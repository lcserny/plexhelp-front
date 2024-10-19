import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, shareReplay} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LANG_KEY} from "../app.component";
import {SecurityService} from "../security/security.service";
import {UserService} from "../user/user.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {DarkModeService} from "../dark-mode.service";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    isLoggedIn = false;
    isLoggedInAdmin = false;
    currentUserId?: string;

    darkModeEnabled = this.darkModeService.darkMode;

    isHandset: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay()
    );

    constructor(private breakpointObserver: BreakpointObserver,
                private securityService: SecurityService,
                private userService: UserService,
                private router: Router,
                private translateService: TranslateService,
                private darkModeService: DarkModeService) {
        this.securityService.user.subscribe(user => {
            this.isLoggedIn = !!user;
            this.isLoggedInAdmin = !!user?.roles.includes("ADMIN");
            this.currentUserId = user?.userId;
        });
    }

    logout() {
        this.securityService.logout().subscribe();
    }

    register() {
        this.router.navigate(["/user/register"]);
    }

    details() {
        this.router.navigate([`/user/details/${this.currentUserId}`]);
    }

    switchLanguage(lang: string) {
        this.translateService.use(lang);
        localStorage.setItem(LANG_KEY, lang);
    }

    onToggleDarkMode(event: MatSlideToggleChange) {
        this.darkModeService.setDarkMode(event.checked);
    }
}
