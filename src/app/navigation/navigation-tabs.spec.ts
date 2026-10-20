import {Component} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, flush, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {Router, RouterModule} from '@angular/router';
import {TranslatePipe, provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {NavigationComponent} from './navigation.component';
import {LoadingComponent} from '../loading/loading.component';
import {LoadingInterceptor} from '../loading.interceptor';
import {JwtInterceptor} from '../security/jwt.interceptor';
import {MagDownTabsComponent} from '../magnets-downloads/tabs/mag-down-tabs.component';
import {MagnetsListComponent} from '../magnets/list/magnets-list.component';
import {DownloadsListComponent} from '../downloads/list/downloads-list.component';
import {CustomDateAdapter} from '../app.component';
import {AuthGuard} from '../security/auth.guard';
import {USER_KEY} from '../security/security.service';

@Component({standalone: false, selector: 'app-stub-page', template: '<p>stub</p>'})
class StubPageComponent {}

/** Full shell: real sidenav + real tabs + real children + real interceptors. */
describe('NavigationComponent magnets/downloads switching', () => {
    let fixture: ComponentFixture<NavigationComponent>;
    let router: Router;
    let httpMock: HttpTestingController;

    beforeEach(fakeAsync(async () => {
        localStorage.setItem(USER_KEY, JSON.stringify({
            accessToken: 'fresh',
            expires: new Date(Date.now() + 3_600_000).toISOString(),
            userId: 'u1',
            roles: ['USER'],
            perms: [],
        }));
        await TestBed.configureTestingModule({
            declarations: [
                NavigationComponent,
                LoadingComponent,
                MagDownTabsComponent,
                MagnetsListComponent,
                DownloadsListComponent,
                StubPageComponent,
            ],
            imports: [
                BrowserAnimationsModule,
                LayoutModule,
                MatButtonModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                MatToolbarModule,
                MatMenuModule,
                MatSlideToggleModule,
                MatTabsModule,
                MatSnackBarModule,
                MatDialogModule,
                MatFormFieldModule,
                MatPaginatorModule,
                ReactiveFormsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                MatDatepickerModule,
                MatCheckboxModule,
                MatNativeDateModule,
                RouterModule.forRoot([
                    {path: '', component: StubPageComponent, canActivate: [AuthGuard]},
                    {path: 'magnets-downloads/:idx', component: MagDownTabsComponent, canActivate: [AuthGuard]},
                ]),
                HttpClientTestingModule,
                TranslatePipe,
            ],
            providers: [
                provideTranslateService(),
                provideTranslateHttpLoader(),
                DatePipe,
                {provide: DateAdapter, useClass: CustomDateAdapter},
                {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
                {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
            ],
        }).compileComponents();

        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(NavigationComponent);
        fixture.detectChanges();
        tick();
    }));

    afterEach(() => {
        localStorage.removeItem(USER_KEY);
    });

    function flushPendingBackendCalls() {
        for (const req of httpMock.match(() => true)) {
            if (req.request.url.includes('/media-downloads/paginated')) {
                req.flush({content: [], page: {totalElements: 0}});
            } else if (req.request.url.includes('/magnets') && req.request.method === 'GET') {
                req.flush({content: [], page: {totalElements: 0}});
            } else if (req.request.url.includes('/assets/i18n/')) {
                req.flush({});
            } else {
                req.flush({});
            }
        }
    }

    function sidebarLinks(): HTMLAnchorElement[] {
        return fixture.debugElement.queryAll(By.css('mat-nav-list a'))
            .map(el => el.nativeElement as HTMLAnchorElement);
    }

    function activeBodyIndex(): number {
        const bodies = fixture.debugElement.queryAll(By.css('.mat-mdc-tab-body'));
        const idx = bodies.findIndex(b =>
            (b.nativeElement.className as string).includes('mat-mdc-tab-body-active'));
        return idx;
    }

    it('clicking sidebar downloads from magnets switches the visible tab', fakeAsync(async () => {
        await router.navigate(['/magnets-downloads/0']);
        tick(1000);
        flushPendingBackendCalls();
        flush();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(router.url).toBe('/magnets-downloads/0');
        expect(activeBodyIndex()).toBe(0);

        const links = sidebarLinks();
        const downloads = links.find(a => (a.getAttribute('href') || '').endsWith('/magnets-downloads/1'));
        expect(downloads).toBeTruthy();
        downloads!.click();
        tick(1000);
        flushPendingBackendCalls();
        flush();
        fixture.detectChanges();
        await fixture.whenStable();
        tick(1000);
        flush();
        fixture.detectChanges();

        expect(router.url).toBe('/magnets-downloads/1');
        expect(activeBodyIndex()).toBe(1);
    }));

    it('clicking sidebar downloads with an expired session still switches the visible tab', fakeAsync(async () => {
        await router.navigate(['/magnets-downloads/0']);
        tick(1000);
        flushPendingBackendCalls();
        flush();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(activeBodyIndex()).toBe(0);

        // Let the access token expire (guard will refresh on next navigation,
        // briefly nulling the user and rebuilding the *ngIf sidebar links).
        tick(4 * 3_600_000);

        const links = sidebarLinks();
        const downloads = links.find(a => (a.getAttribute('href') || '').endsWith('/magnets-downloads/1'));
        expect(downloads).toBeTruthy();
        downloads!.click();
        tick();
        // Guard-triggered refresh first...
        for (const req of httpMock.match(`${'/auth'}/authenticate/refresh`)) {
            req.flush({
                accessToken: 'refreshed',
                expires: new Date(Date.now() + 3_600_000).toISOString(),
                userId: 'u1',
                roles: ['USER'],
                perms: [],
            });
        }
        tick(1000);
        flushPendingBackendCalls();
        flush();
        fixture.detectChanges();
        await fixture.whenStable();
        tick(1000);
        flush();
        fixture.detectChanges();

        expect(router.url).toBe('/magnets-downloads/1');
        expect(activeBodyIndex()).toBe(1);
    }));
});
