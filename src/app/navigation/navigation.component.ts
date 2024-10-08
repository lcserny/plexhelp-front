import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, shareReplay} from 'rxjs';
import {map} from 'rxjs/operators';
import {SecurityService} from "../security.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LANG_KEY} from "../app.component";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    isLoggedIn = false;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay()
    );

    constructor(private breakpointObserver: BreakpointObserver, private securityService: SecurityService,
                private router: Router, private translateService: TranslateService) {
        this.securityService.user.subscribe(user => {
            this.isLoggedIn = !!user;
        });
    }

    logout() {
        this.securityService.logout().subscribe();
    }

    register() {
        this.router.navigate(["/security/register"]);
    }

    switchLanguage(lang: string) {
        this.translateService.use(lang);
        localStorage.setItem(LANG_KEY, lang);
    }
}
