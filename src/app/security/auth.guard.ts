import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {SecurityService} from "./security.service";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    constructor(protected router: Router, protected securityService: SecurityService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.securityService.userValue) {
            return true;
        }

        this.router.navigate(["/security/login"], {queryParams: {returnUrl: state.url}});
        return false;
    }
}

@Injectable({providedIn: "root"})
export class AdminAuthGuard extends AuthGuard {

    override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.securityService.userValue;
        if (user && user?.roles.includes("ADMIN")) {
            return true;
        }

        this.router.navigate(["/security/login"], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
