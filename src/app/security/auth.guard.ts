import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {SecurityService} from "./security.service";
import {firstValueFrom} from "rxjs";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    constructor(protected router: Router, protected securityService: SecurityService) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (!this.validate()) {
            return this.redirectLogin(state);
        }

        if (this.tokenExpired()) {
            const result = await firstValueFrom(this.securityService.refresh());
            if (!result) {
                return this.redirectLogin(state);
            }
        }

        return true;
    }

    validate(): boolean {
        return !!this.securityService.userValue;
    }

    private tokenExpired(): boolean {
        const user = this.securityService.userValue;
        if (user && user.expires) {
            const expirationTimestamp = new Date(user.expires);
            const now = new Date();
            return expirationTimestamp.getTime() < now.getTime();
        }
        return true;
    }

    private async redirectLogin(state: RouterStateSnapshot): Promise<boolean> {
        this.router.navigate(["/security/login"], {queryParams: {returnUrl: state.url}});
        return false;
    }
}

@Injectable({providedIn: "root"})
export class AdminAuthGuard extends AuthGuard {

    override validate(): boolean {
        const user = this.securityService.userValue;
        return !!(user && user?.roles.includes("ADMIN"));
    }
}
