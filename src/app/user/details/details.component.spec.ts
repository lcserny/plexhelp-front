import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from "@angular/common/http/testing";
import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {ActivatedRoute, convertToParamMap, Router, RouterModule} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {MatSnackBarModule, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Mocked, vi} from "vitest";

import {DetailsComponent, FETCH_FAILED_KEY} from './details.component';
import {routes} from "../../routing/routing.module";
import {SecurityService} from "../../security/security.service";
import {UserAccess} from "../../generated/auth/model/userAccess";
import {UserData} from "../../generated/auth/model/userData";
import {environment} from "../../../environments/environment";
import {CLOSE_KEY, DURATION} from "../../app.component";

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let httpMock: HttpTestingController;
    let router: Router;
    let location: Location;
    let mockUserValue: UserAccess | null;
    let mockSecurityService: Mocked<SecurityService>;

    const USER_ID = "42";
    const userUrl = `${environment.securityApiUrl}/users/${USER_ID}`;

    const defaultUser: UserData = {
        id: USER_ID,
        username: "john",
        password: "secret",
        firstName: "John",
        lastName: "Doe",
        roles: ["ADMIN", "STANDARD"],
        perms: ["READ", "WRITE"],
        status: "active",
        created: "2024-01-15T10:30:00Z"
    };

    const adminUser: UserAccess = {
        accessToken: "token",
        userId: "1",
        roles: ["ADMIN"],
        perms: ["READ", "WRITE"]
    };

    const writerUser: UserAccess = {
        accessToken: "token",
        userId: "2",
        roles: ["STANDARD"],
        perms: ["READ", "WRITE"]
    };

    const readerUser: UserAccess = {
        accessToken: "token",
        userId: "3",
        roles: ["STANDARD"],
        perms: ["READ"]
    };

    const createComponent = (userValue: UserAccess | null = null): ComponentFixture<DetailsComponent> => {
        mockUserValue = userValue;
        const created = TestBed.createComponent(DetailsComponent);
        created.detectChanges();
        return created;
    };

    const expectUserRequest = (): TestRequest =>
        httpMock.expectOne(r => r.method === 'GET' && r.url === userUrl);

    const flushUser = (): void => {
        expectUserRequest().flush(defaultUser);
    };

    const spyOnSnackBar = (target: DetailsComponent) => vi.spyOn(target.snackBar, 'open')
        .mockReturnValue(undefined as unknown as MatSnackBarRef<any>);

    beforeEach(async () => {
        mockUserValue = null;
        mockSecurityService = {
            get userValue(): UserAccess | null {
                return mockUserValue;
            }
        } as unknown as Mocked<SecurityService>;

        await TestBed.configureTestingModule({
            declarations: [DetailsComponent],
            imports: [MatSnackBarModule,
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                NoopAnimationsModule,
                ReactiveFormsModule,
                MatInputModule,
                MatButtonModule,
                MatFormFieldModule,
                MatIconModule,
                MatCardModule,
                MatDatepickerModule,
                MatNativeDateModule],
            providers: [DatePipe,
                {provide: SecurityService, useValue: mockSecurityService},
                {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({idx: USER_ID})}}},
                provideHttpClient(withXhr(), withInterceptorsFromDi()),
                provideHttpClientTesting()]
        }).compileComponents();

        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);

        fixture = createComponent();
        component = fixture.componentInstance;
        flushUser();
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should read the user id from the route parameters', () => {
        expect(component.userId).toBe(USER_ID);
    });

    it('should request the user data on init', () => {
        createComponent();

        const req = expectUserRequest();

        expect(req.request.url).toBe(`${environment.securityApiUrl}/users/${USER_ID}`);
        req.flush(defaultUser);
    });

    it('should build the form with the expected controls', () => {
        expect(Object.keys(component.detailsForm!.controls))
            .toEqual(['username', 'password', 'firstName', 'lastName', 'roles', 'perms', 'status', 'created']);
    });

    it('should populate the form with the fetched user data', () => {
        expect(component.detailsForm!.get('username')?.value).toBe('john');
        expect(component.detailsForm!.get('password')?.value).toBe('secret');
        expect(component.detailsForm!.get('firstName')?.value).toBe('John');
        expect(component.detailsForm!.get('lastName')?.value).toBe('Doe');
        expect(component.detailsForm!.get('status')?.value).toBe('active');
        expect(component.detailsForm!.get('created')?.value).toBe('2024-01-15T10:30:00Z');
    });

    it('should build the roles and the perms arrays from the user data', () => {
        expect(component.roles.length).toBe(2);
        expect(component.roles.getRawValue()).toEqual(['ADMIN', 'STANDARD']);
        expect(component.perms.length).toBe(2);
        expect(component.perms.getRawValue()).toEqual(['READ', 'WRITE']);
    });

    it('should keep the roles and the perms read only', () => {
        expect(component.roles.controls.every(control => control.disabled)).toBe(true);
        expect(component.perms.controls.every(control => control.disabled)).toBe(true);
    });

    it('should not allow updates when there is no logged user', () => {
        expect(component.canUpdate).toBe(false);
    });

    it('should allow updates when the logged user has the WRITE permission', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();

        expect(writeFixture.componentInstance.canUpdate).toBe(true);
    });

    it('should not allow updates when the logged user only has the READ permission', () => {
        const readFixture = createComponent(readerUser);
        flushUser();

        expect(readFixture.componentInstance.canUpdate).toBe(false);
    });

    it('should not be an admin when the logged user has no ADMIN role', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();

        expect(writeFixture.componentInstance.isAdmin).toBe(false);
    });

    it('should be an admin when the logged user has the ADMIN role', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();

        expect(adminFixture.componentInstance.isAdmin).toBe(true);
    });

    it('should disable the editable fields when the user cannot update', () => {
        expect(component.detailsForm!.get('password')?.disabled).toBe(true);
        expect(component.detailsForm!.get('firstName')?.disabled).toBe(true);
        expect(component.detailsForm!.get('lastName')?.disabled).toBe(true);
        expect(component.detailsForm!.get('status')?.disabled).toBe(true);
        expect(component.detailsForm!.get('created')?.disabled).toBe(true);
    });

    it('should always keep the username read only', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();

        expect(adminFixture.componentInstance.detailsForm!.get('username')?.disabled).toBe(true);
    });

    it('should enable the editable fields when the user can update', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();

        const detailsForm = adminFixture.componentInstance.detailsForm!;
        expect(detailsForm.get('password')?.disabled).toBe(false);
        expect(detailsForm.get('firstName')?.disabled).toBe(false);
        expect(detailsForm.get('lastName')?.disabled).toBe(false);
        expect(detailsForm.get('status')?.disabled).toBe(false);
        expect(detailsForm.get('created')?.disabled).toBe(false);
    });

    it('should keep the status and the creation date read only when the user is not an admin', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();

        const detailsForm = writeFixture.componentInstance.detailsForm!;
        expect(detailsForm.get('password')?.disabled).toBe(false);
        expect(detailsForm.get('status')?.disabled).toBe(true);
        expect(detailsForm.get('created')?.disabled).toBe(true);
    });

    it('add() should append an empty control to the given array', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        const target = writeFixture.componentInstance;

        target.add(target.roles);

        expect(target.roles.length).toBe(3);
        expect(target.roles.at(2).value).toBe('');
        expect(target.roles.at(2).disabled).toBe(false);
        expect(target.roles.at(2).hasError('required')).toBe(true);
    });

    it('add() should add a disabled control when the user cannot update', () => {
        component.add(component.perms);

        expect(component.perms.length).toBe(3);
        expect(component.perms.at(2).disabled).toBe(true);
    });

    it('add() should only accept uppercase values', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        const target = writeFixture.componentInstance;

        target.add(target.roles);
        const added = target.roles.at(2);

        added.setValue('admin');
        expect(added.valid).toBe(false);
        expect(added.errors?.['pattern']).toBeDefined();

        added.setValue('ADMIN');
        expect(added.valid).toBe(true);
        expect(added.errors).toBeNull();
    });

    it('remove() should remove the control at the given index', () => {
        component.remove(component.roles, 0);

        expect(component.roles.length).toBe(1);
        expect(component.roles.getRawValue()).toEqual(['STANDARD']);
    });

    it('update() should show an error and not send a request when the form is invalid', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        const target = writeFixture.componentInstance;
        const snackBarSpy = spyOnSnackBar(target);

        target.detailsForm!.get('firstName')?.setValue('John123');
        expect(target.detailsForm!.valid).toBe(false);

        target.update();

        expect(snackBarSpy).toHaveBeenCalledWith(FETCH_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        httpMock.expectNone(r => r.method === 'PUT');
    });

    it('update() should send the form data to the user endpoint', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();
        const target = adminFixture.componentInstance;

        target.update();

        const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === userUrl);
        expect(req.request.body).toEqual({
            id: USER_ID,
            username: "john",
            password: "secret",
            firstName: "John",
            lastName: "Doe",
            roles: ["ADMIN", "STANDARD"],
            perms: ["READ", "WRITE"],
            status: "active",
            created: "2024-01-15T10:30:00Z"
        });
        req.flush(defaultUser);
    });

    it('update() should navigate to the user details page when the update succeeds', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();
        const target = adminFixture.componentInstance;
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

        target.update();
        httpMock.expectOne(r => r.method === 'PUT' && r.url === userUrl).flush(defaultUser);

        expect(navigateSpy).toHaveBeenCalledWith([`/user/details/${USER_ID}`]);
    });

    it('update() should show an error and not navigate when the update fails', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();
        const target = adminFixture.componentInstance;
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
        const snackBarSpy = spyOnSnackBar(target);

        target.update();
        httpMock.expectOne(r => r.method === 'PUT' && r.url === userUrl)
            .flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(snackBarSpy).toHaveBeenCalledWith(FETCH_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should show an error and keep the form empty when the user cannot be fetched', () => {
        const snackBarSpy = spyOnSnackBar(component);
        const failingFixture = createComponent();

        expectUserRequest().flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(snackBarSpy).toHaveBeenCalledWith(FETCH_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        expect(failingFixture.componentInstance.detailsForm).toBeUndefined();
    });

    it('goBack() should return to the previous page', () => {
        const backSpy = vi.spyOn(location, 'back');

        component.goBack();

        expect(backSpy).toHaveBeenCalled();
    });

    it('should render the fetched user data in the form', () => {
        const usernameInput = fixture.nativeElement.querySelector('input[formControlName="username"]') as HTMLInputElement;
        const firstNameInput = fixture.nativeElement.querySelector('input[formControlName="firstName"]') as HTMLInputElement;
        const lastNameInput = fixture.nativeElement.querySelector('input[formControlName="lastName"]') as HTMLInputElement;

        expect(usernameInput.value).toBe('john');
        expect(firstNameInput.value).toBe('John');
        expect(lastNameInput.value).toBe('Doe');
    });

    it('should disable the update button when the user cannot update', () => {
        const button = fixture.nativeElement.querySelector('button.update-button') as HTMLButtonElement;

        expect(button.disabled).toBe(true);
    });

    it('should enable the update button when the user can update', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        writeFixture.detectChanges();

        const button = writeFixture.nativeElement.querySelector('button.update-button') as HTMLButtonElement;

        expect(button.disabled).toBe(false);
    });

    it('should not render the roles and the perms for a user that is not an admin', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        writeFixture.detectChanges();

        const cards = writeFixture.nativeElement.querySelectorAll('mat-card.list-card');

        expect(cards.length).toBe(0);
    });

    it('should render the roles and the perms for an admin', () => {
        const adminFixture = createComponent(adminUser);
        flushUser();
        adminFixture.detectChanges();

        const cards = adminFixture.nativeElement.querySelectorAll('mat-card.list-card');

        expect(cards.length).toBe(2);
    });

    it('should show the validation errors of the invalid fields', () => {
        const writeFixture = createComponent(writerUser);
        flushUser();
        const target = writeFixture.componentInstance;

        target.detailsForm!.get('firstName')?.setValue('John123');
        target.detailsForm!.get('firstName')?.markAsTouched();
        writeFixture.detectChanges();

        const errors = writeFixture.nativeElement.querySelectorAll('mat-error');

        expect(errors.length).toBe(1);
        expect(errors[0].textContent).toContain('first name invalid');
    });

    it('should go back when the back button is clicked', () => {
        const backSpy = vi.spyOn(location, 'back');

        const button = fixture.nativeElement.querySelector('#back-btn') as HTMLButtonElement;
        button.click();

        expect(backSpy).toHaveBeenCalled();
    });
});
