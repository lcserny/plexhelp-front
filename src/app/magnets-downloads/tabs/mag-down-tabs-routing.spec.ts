import {Component} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, flush, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {TranslatePipe, provideTranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

import {MagDownTabsComponent} from './mag-down-tabs.component';
import {MagnetsListComponent} from '../../magnets/list/magnets-list.component';
import {DownloadsListComponent} from '../../downloads/list/downloads-list.component';
import {CustomDateAdapter} from '../../app.component';
import {AuthGuard} from '../../security/auth.guard';
import {USER_KEY} from '../../security/security.service';

@Component({standalone: false, selector: 'app-test-host', template: '<router-outlet></router-outlet>'})
class TestHostComponent {}

@Component({standalone: false, selector: 'app-login-stub', template: '<p>login</p>'})
class StubLoginComponent {}

function flushInitialListRequests(httpMock: HttpTestingController) {
    for (const req of httpMock.match(() => true)) {
        if (req.request.url.includes('/media-downloads/paginated')) {
            req.flush({content: [], page: {totalElements: 0}});
        } else if (req.request.url.includes('/magnets')) {
            req.flush({content: [], page: {totalElements: 0}});
        } else {
            fail(`unexpected request: ${req.request.method} ${req.request.url}`);
        }
    }
}

describe('MagDownTabsComponent routing', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let router: Router;
    let httpMock: HttpTestingController;
    let tabs: MagDownTabsComponent;

    beforeEach(fakeAsync(async () => {
        await TestBed.configureTestingModule({
            declarations: [MagDownTabsComponent, MagnetsListComponent, DownloadsListComponent, TestHostComponent],
            imports: [
                RouterModule.forRoot([
                    {path: 'magnets-downloads/:idx', component: MagDownTabsComponent},
                ]),
                MatTabsModule,
                BrowserAnimationsModule,
                TranslatePipe,
                HttpClientTestingModule,
                MatSnackBarModule,
                MatDialogModule,
                MatIconModule,
                MatFormFieldModule,
                MatPaginatorModule,
                ReactiveFormsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                MatDatepickerModule,
                MatCheckboxModule,
                MatNativeDateModule,
            ],
            providers: [provideTranslateService(), DatePipe, {provide: DateAdapter, useClass: CustomDateAdapter}],
        }).compileComponents();

        // NOTE: real MagDownTabsComponent template + real list children.
        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const nav = router.navigate(['/magnets-downloads/0']);
        tick();
        flushInitialListRequests(httpMock);
        await nav;
        tick();
        fixture.detectChanges();
        await fixture.whenStable();
        tabs = fixture.debugElement.query(By.directive(MagDownTabsComponent)).componentInstance;
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('should create on tab 0', fakeAsync(() => {
        expect(tabs).toBeTruthy();
        expect(tabs.selectedTabIndex).toBe(0);
    }));

    it('sidebar: navigating 0 -> 1 should switch tab', fakeAsync(async () => {
        await router.navigate(['/magnets-downloads/1']);
        tick(1000);
        flush();
        fixture.detectChanges();
        await fixture.whenStable();
        tick(1000);
        flush();
        fixture.detectChanges();
        expect(tabs.selectedTabIndex).toBe(1);
        // ... and the view must follow: second header active, second body shown
        const headers = fixture.debugElement.queryAll(By.css('.mdc-tab'));
        expect(headers[1].nativeElement.getAttribute('aria-selected')).toBe('true');
        expect(headers[1].nativeElement.classList).toContain('mdc-tab--active');
        const bodies = fixture.debugElement.queryAll(By.css('.mat-mdc-tab-body'));
        const activeBodies = bodies.filter(b =>
            (b.nativeElement.className as string).includes('mat-mdc-tab-body-active'));
        expect(activeBodies.length).toBe(1);
        expect(bodies.indexOf(activeBodies[0])).toBe(1);
    }));

    it('tab click: should update URL', fakeAsync(async () => {
        const headers = fixture.debugElement.queryAll(By.css('.mdc-tab'));
        expect(headers.length).toBe(2);
        headers[1].nativeElement.click();
        tick();
        fixture.detectChanges();
        await fixture.whenStable();
        tick();
        fixture.detectChanges();
        expect(router.url).toBe('/magnets-downloads/1');
        expect(tabs.selectedTabIndex).toBe(1);
    }));
});

describe('MagDownTabsComponent routing with expired token', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let router: Router;
    let httpMock: HttpTestingController;

    const expiredUser = {
        accessToken: 'expired',
        expires: new Date(Date.now() - 60_000).toISOString(),
        userId: 'u1',
        roles: ['USER'],
        perms: [],
    };
    const freshUser = {
        accessToken: 'fresh',
        expires: new Date(Date.now() + 3_600_000).toISOString(),
        userId: 'u1',
        roles: ['USER'],
        perms: [],
    };

    beforeEach(fakeAsync(async () => {
        localStorage.setItem(USER_KEY, JSON.stringify(expiredUser));
        await TestBed.configureTestingModule({
            declarations: [MagDownTabsComponent, MagnetsListComponent, DownloadsListComponent, TestHostComponent, StubLoginComponent],
            imports: [
                RouterModule.forRoot([
                    {path: 'magnets-downloads/:idx', component: MagDownTabsComponent, canActivate: [AuthGuard]},
                    {path: 'security/login', component: StubLoginComponent},
                ]),
                MatTabsModule,
                NoopAnimationsModule,
                TranslatePipe,
                HttpClientTestingModule,
                MatSnackBarModule,
                MatDialogModule,
                MatIconModule,
                MatFormFieldModule,
                MatPaginatorModule,
                ReactiveFormsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                MatDatepickerModule,
                MatCheckboxModule,
                MatNativeDateModule,
            ],
            providers: [provideTranslateService(), DatePipe, {provide: DateAdapter, useClass: CustomDateAdapter}],
        }).compileComponents();

        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const nav = router.navigate(['/magnets-downloads/0']);
        tick();
        const refreshReq = httpMock.expectOne(`${environment.securityApiUrl}/authenticate/refresh`);
        refreshReq.flush(freshUser);
        tick();
        flushInitialListRequests(httpMock);
        await nav;
        tick();
        fixture.detectChanges();
        await fixture.whenStable();
    }));

    afterEach(() => {
        localStorage.removeItem(USER_KEY);
        httpMock.verify();
    });

    it('sidebar: navigating 0 -> 1 with refreshed token should switch tab', fakeAsync(async () => {
        const tabsComp: MagDownTabsComponent = fixture.debugElement.query(
            By.directive(MagDownTabsComponent)).componentInstance;
        expect(tabsComp.selectedTabIndex).toBe(0);
        await router.navigate(['/magnets-downloads/1']);
        tick();
        fixture.detectChanges();
        await fixture.whenStable();
        tick();
        fixture.detectChanges();
        expect(router.url).toBe('/magnets-downloads/1');
        expect(tabsComp.selectedTabIndex).toBe(1);
    }));
});
