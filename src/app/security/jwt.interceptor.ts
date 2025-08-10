import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {UserAccess} from "../generated/auth/model/userAccess";
import {SecurityService} from "./security.service";
import {Router} from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private securityService: SecurityService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.addTokenHeader(req, this.securityService.userValue);

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if ([401, 403].includes(err.status)) {
                    return this.handleAccessDenied(req, next);
                } else {
                    return throwError(() => err);
                }
            })
        );
    }

    private addTokenHeader(request: HttpRequest<any>, user: UserAccess | null): HttpRequest<any> {
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

    private handleAccessDenied(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.securityService.refresh().pipe(
            switchMap((user) => {
                let clonedRequest = this.addTokenHeader(request, user);
                return next.handle(clonedRequest);
            }),
            catchError((err: HttpErrorResponse) => {
                return this.securityService.logout().pipe(
                    switchMap(() => {
                        this.router.navigate(["/security/login"]);
                        return throwError(() => err);
                    })
                );
            })
        );
    }
}
