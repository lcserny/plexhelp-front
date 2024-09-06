import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {SecurityService} from "../security.service";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {UserAccess} from "./models/users";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private securityService: SecurityService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.securityService.userValue;
        req = this.addTokenHeader(req, user);

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if ([401, 403].includes(err.status)) {
                    return this.handle401Error(req, next);
                } else {
                    return throwError(() => err);
                }
            })
        );
    }

    private addTokenHeader(request: HttpRequest<any>, user: UserAccess | null) {
        const accessToken = user?.accessToken;
        const isApiUrl = request.url.startsWith(environment.commanderApiUrl);

        if (accessToken && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }

        return request;
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.securityService.refresh().pipe(
            switchMap((user) => {
                let clonedRequest = this.addTokenHeader(request, user);
                return next.handle(clonedRequest);
            }),
            catchError((err: HttpErrorResponse) => {
                this.securityService.logout().subscribe();
                return throwError(() => err);
            })
        );
    }
}
