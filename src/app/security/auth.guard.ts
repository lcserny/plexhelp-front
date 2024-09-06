import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {SecurityService} from "../security.service";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private securityService: SecurityService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.securityService.userValue) {
            return true;
        }

        this.router.navigate(["/security/login"], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
