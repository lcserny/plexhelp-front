import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";

import {ListComponent} from './list.component';
import {MatSnackBarModule, MatSnackBarRef} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {Router, RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DatePipe} from "@angular/common";
import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {Mocked, vi} from "vitest";

import {SecurityService} from "../../security/security.service";
import {UserData} from "../../generated/auth/model/userData";
import {UserAccess} from "../../generated/auth/model/userAccess";
import {environment} from "../../../environments/environment";

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let httpMock: HttpTestingController;
    let router: Router;
    let mockUserValue: UserAccess | null;
    let mockSecurityService: Mocked<SecurityService>;
    let initialRequestUrl: string;

    const USERS_PER_PAGE_KEY = "vm-front-users-perPage";

    const userWithWrite: UserAccess = {
        accessToken: "token",
        userId: "1",
        roles: ["ADMIN"],
        perms: ["READ", "WRITE"]
    };

    const userWithReadOnly: UserAccess = {
        accessToken: "token",
        userId: "2",
        roles: ["STANDARD"],
        perms: ["READ"]
    };

    const buildUser = (overrides: Partial<UserData> = {}): UserData => ({
        id: "1",
        username: "john",
        firstName: "John",
        lastName: "Doe",
        status: "active",
        created: "2024-01-15T10:30:00Z",
        ...overrides
    });

    const createComponent = (userValue: UserAccess | null = null): ComponentFixture<ListComponent> => {
        mockUserValue = userValue;
        const created = TestBed.createComponent(ListComponent);
        created.detectChanges();
        return created;
    };

    const loadUsers = (target: ListComponent,
                       targetFixture: ComponentFixture<ListComponent>,
                       users: UserData[]): void => {
        target.loadData(0, 10);
        httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'))
            .flush({hasMore: false, total: users.length, data: users});
        targetFixture.detectChanges();
    };

    beforeEach(async () => {
        localStorage.removeItem(USERS_PER_PAGE_KEY);
        mockUserValue = null;
        mockSecurityService = {
            get userValue(): UserAccess | null {
                return mockUserValue;
            }
        } as unknown as Mocked<SecurityService>;

        await TestBed.configureTestingModule({
            declarations: [
                ListComponent
            ],
            imports: [MatSnackBarModule,
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                NoopAnimationsModule,
                MatPaginatorModule,
                MatTableModule,
                ReactiveFormsModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule,
                MatFormFieldModule],
            providers: [
                DatePipe,
                {provide: SecurityService, useValue: mockSecurityService},
                provideHttpClient(withXhr(), withInterceptorsFromDi()),
                provideHttpClientTesting()]
        }).compileComponents();

        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);

        fixture = createComponent();
        component = fixture.componentInstance;

        const initialReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'));
        initialRequestUrl = initialReq.request.url;
        initialReq.flush({hasMore: false, total: 0, data: []});
    });

    afterEach(() => {
        httpMock.verify();
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the expected default configuration values', () => {
        expect(component.pageSizeOptions).toEqual(environment.pageSizeOptions.usersList);
        expect(component.defaultPageSize).toBe(environment.pageSizeOptions.usersList[1]);
        expect(component.displayedColumns).toEqual(["edit", "id", "username", "firstName", "lastName", "status", "created"]);
        expect(component.totalItems).toBe(0);
        expect(component.dataSource.data).toEqual([]);
    });

    it('should load the first page of users on init', () => {
        expect(initialRequestUrl).toBe(`${environment.securityApiUrl}/users?page=0&perPage=10`);
    });

    it('should not allow updates when there is no logged user', () => {
        expect(component.canUpdate).toBe(false);
    });

    it('should allow updates when the logged user has the WRITE permission', () => {
        const writeFixture = createComponent(userWithWrite);
        httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'))
            .flush({hasMore: false, total: 0, data: []});

        expect(writeFixture.componentInstance.canUpdate).toBe(true);
    });

    it('should not allow updates when the logged user only has the READ permission', () => {
        const readFixture = createComponent(userWithReadOnly);
        httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'))
            .flush({hasMore: false, total: 0, data: []});

        expect(readFixture.componentInstance.canUpdate).toBe(false);
    });

    it('produceNumbersControl() should only accept alphanumeric characters', () => {
        const control = component.produceNumbersControl();

        expect(control.valid).toBe(true);
        expect(control.errors).toBeNull();

        control.setValue('user123');
        expect(control.valid).toBe(true);

        control.setValue('user name');
        expect(control.valid).toBe(false);
        expect(control.errors?.['pattern']).toBeDefined();
    });

    it('produceTextControl() should only accept letters, dashes and apostrophes', () => {
        const control = component.produceTextControl();

        expect(control.valid).toBe(true);
        expect(control.errors).toBeNull();

        control.setValue("O'Brien-Smith");
        expect(control.valid).toBe(true);

        control.setValue('John123');
        expect(control.valid).toBe(false);
        expect(control.errors?.['pattern']).toBeDefined();
    });

    it('reset() should clear the filters and reload the data', () => {
        const loadDataSpy = vi.spyOn(component, 'loadData').mockReturnValue(undefined);

        component.searchForm.get('username')?.setValue('john');
        component.searchForm.get('firstName')?.setValue('John');
        component.searchForm.get('lastName')?.setValue('Doe');

        component.reset();

        expect(component.searchForm.get('username')?.value).toBe('');
        expect(component.searchForm.get('firstName')?.value).toBe('');
        expect(component.searchForm.get('lastName')?.value).toBe('');
        expect(loadDataSpy).toHaveBeenCalledWith(0, component.defaultPageSize);
    });

    it('search() should reload the data using the entered filters', () => {
        component.searchForm.get('username')?.setValue('john');
        component.searchForm.get('firstName')?.setValue('John');
        component.searchForm.get('lastName')?.setValue('Doe');

        component.search();

        const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'));
        expect(req.request.url).toBe(
            `${environment.securityApiUrl}/users?page=0&perPage=10&username=john&firstName=John&lastName=Doe`);
        req.flush({hasMore: false, total: 0, data: []});
    });

    it('search() should show an error and not search when the form is invalid', () => {
        const snackBarSpy = vi.spyOn(component['snackBar'], 'open')
            .mockReturnValue(undefined as unknown as MatSnackBarRef<any>);

        component.searchForm.get('username')?.setValue('invalid@value');
        expect(component.searchForm.valid).toBe(false);

        component.search();

        expect(snackBarSpy).toHaveBeenCalled();
        httpMock.expectNone(r => r.url.includes('/users'));
    });

    it('loadData() should update the data source and the total items', () => {
        const users = [buildUser(), buildUser({id: '2', username: 'jane', firstName: 'Jane', lastName: 'Smith'})];

        component.loadData(0, 10);

        const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'));
        expect(req.request.url).toBe(`${environment.securityApiUrl}/users?page=0&perPage=10`);
        req.flush({hasMore: true, total: 42, data: users});

        expect(component.dataSource.data).toEqual(users);
        expect(component.totalItems).toBe(42);
    });

    it('loadData() should show an error when the request fails', () => {
        const snackBarSpy = vi.spyOn(component['snackBar'], 'open')
            .mockReturnValue(undefined as unknown as MatSnackBarRef<any>);

        component.loadData(0, 10);

        const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'));
        req.flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(snackBarSpy).toHaveBeenCalled();
    });

    it('onPageChange() should save the page size in localStorage and reload the data', () => {
        const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        });
        const loadDataSpy = vi.spyOn(component, 'loadData').mockReturnValue(undefined);

        component.onPageChange({pageIndex: 2, pageSize: 25, length: 100});

        expect(setItemSpy).toHaveBeenCalledWith(USERS_PER_PAGE_KEY, '25');
        expect(loadDataSpy).toHaveBeenCalledWith(2, 25);
    });

    it('viewEdit() should navigate to the user details page', () => {
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

        component.viewEdit('42');

        expect(navigateSpy).toHaveBeenCalledWith(['/user/details/42']);
    });

    it('formatDate() should format the provided date', () => {
        const date = '2024-01-15T10:30:00Z';

        expect(component.formatDate(date)).toBe(new DatePipe('en-US').transform(date) as string);
    });

    it('formatDate() should return the no date text when the date is missing', () => {
        expect(component.formatDate(undefined)).toBe(component.noDateText);
        expect(component.formatDate('')).toBe(component.noDateText);
    });

    it('should render the loaded users in the table', () => {
        const users = [buildUser(), buildUser({id: '2', username: 'jane', firstName: 'Jane', lastName: 'Smith'})];

        loadUsers(component, fixture, users);

        const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('john');
        expect(rows[1].textContent).toContain('jane');
    });

    it('should disable the edit button when the user cannot update', () => {
        loadUsers(component, fixture, [buildUser()]);

        const button = fixture.nativeElement.querySelector('button[mat-icon-button]');

        expect(button.disabled).toBe(true);
    });

    it('should enable the edit button when the user can update', () => {
        const writeFixture = createComponent(userWithWrite);
        httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/users'))
            .flush({hasMore: false, total: 0, data: []});

        loadUsers(writeFixture.componentInstance, writeFixture, [buildUser()]);

        const button = writeFixture.nativeElement.querySelector('button[mat-icon-button]');

        expect(button.disabled).toBe(false);
    });
});
