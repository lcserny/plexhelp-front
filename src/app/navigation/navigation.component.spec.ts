import {LayoutModule} from '@angular/cdk/layout';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

import {NavigationComponent} from './navigation.component';
import {Router, RouterModule} from "@angular/router";
import {routes} from "../routing/routing.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {SecurityService} from "../security/security.service";
import {DarkModeService} from "../dark-mode.service";
import {BehaviorSubject, of} from "rxjs";
import {UserAccess} from "../generated/auth/model/userAccess";
import {vi} from "vitest";
import {LANG_KEY} from "../app.component";

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;
    let mockSecurityService: any;
    let mockDarkModeService: any;
    let router: Router;
    let userSubject: BehaviorSubject<UserAccess | null>;

    const adminUser: UserAccess = {
        accessToken: "token",
        userId: "1",
        roles: ["ADMIN"],
        perms: ["READ", "WRITE"]
    };

    const standardUser: UserAccess = {
        accessToken: "token",
        userId: "42",
        roles: ["STANDARD"],
        perms: ["READ"]
    };

    beforeEach(async () => {
        userSubject = new BehaviorSubject<UserAccess | null>(null);
        mockSecurityService = {
            user: userSubject.asObservable(),
            logout: vi.fn().mockReturnValue(of({message: "logged out"}))
        };
        mockDarkModeService = {
            darkMode: of(false),
            setDarkMode: vi.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [NavigationComponent],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
            imports: [NoopAnimationsModule,
                LayoutModule,
                MatButtonModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                MatToolbarModule,
                RouterModule.forRoot(routes),
                TranslateModule.forRoot(),
                MatMenuModule,
                MatSlideToggleModule],
            providers: [
                {provide: SecurityService, useValue: mockSecurityService},
                {provide: DarkModeService, useValue: mockDarkModeService},
                provideHttpClient(withXhr(), withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values when no user is logged in', () => {
        expect(component.isLoggedIn).toBe(false);
        expect(component.isLoggedInAdmin).toBe(false);
        expect(component.currentUserId).toBeUndefined();
    });

    it('should update user state when a standard user logs in', () => {
        userSubject.next(standardUser);
        fixture.detectChanges();

        expect(component.isLoggedIn).toBe(true);
        expect(component.isLoggedInAdmin).toBe(false);
        expect(component.currentUserId).toBe("42");
    });

    it('should update user state when an admin user logs in', () => {
        userSubject.next(adminUser);
        fixture.detectChanges();

        expect(component.isLoggedIn).toBe(true);
        expect(component.isLoggedInAdmin).toBe(true);
        expect(component.currentUserId).toBe("1");
    });

    it('should clear user state when user logs out', () => {
        userSubject.next(standardUser);
        fixture.detectChanges();
        expect(component.isLoggedIn).toBe(true);

        userSubject.next(null);
        fixture.detectChanges();
        expect(component.isLoggedIn).toBe(false);
        expect(component.isLoggedInAdmin).toBe(false);
        expect(component.currentUserId).toBeUndefined();
    });

    it('logout() should call securityService.logout()', () => {
        component.logout();
        expect(mockSecurityService.logout).toHaveBeenCalled();
    });

    it('register() should navigate to /user/register', () => {
        const navigateSpy = vi.spyOn(router, 'navigate');
        component.register();
        expect(navigateSpy).toHaveBeenCalledWith(["/user/register"]);
    });

    it('details() should navigate to /user/details/:currentUserId', () => {
        const navigateSpy = vi.spyOn(router, 'navigate');
        component.currentUserId = "123";
        component.details();
        expect(navigateSpy).toHaveBeenCalledWith(["/user/details/123"]);
    });

    it('switchLanguage() should use translate service and store in localStorage', () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
        component.switchLanguage('ro');
        expect(setItemSpy).toHaveBeenCalledWith(LANG_KEY, 'ro');
    });

    it('onToggleDarkMode() should call darkModeService.setDarkMode with event checked value', () => {
        const event = {checked: true} as MatSlideToggleChange;
        component.onToggleDarkMode(event);
        expect(mockDarkModeService.setDarkMode).toHaveBeenCalledWith(true);

        const event2 = {checked: false} as MatSlideToggleChange;
        component.onToggleDarkMode(event2);
        expect(mockDarkModeService.setDarkMode).toHaveBeenCalledWith(false);
    });

    it('should have isHandset observable', () => {
        expect(component.isHandset).toBeDefined();
    });

    it('should have darkModeEnabled from darkModeService', () => {
        expect(component.darkModeEnabled).toBeDefined();
    });
});
