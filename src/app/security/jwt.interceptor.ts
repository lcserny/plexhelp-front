import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {UserAccess} from "../generated/auth/model/userAccess";
import {SecurityService} from "./security.service";

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
        if (accessToken) {
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
