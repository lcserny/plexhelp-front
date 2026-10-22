import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";

import {FAILED_MSG, RegisterComponent} from './register.component';
import {MatSnackBarModule, MatSnackBarRef} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {Router, RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateModule} from "@ngx-translate/core";
import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {vi} from "vitest";

import {environment} from "../../../environments/environment";
import {CLOSE_KEY, DURATION} from "../../app.component";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let httpMock: HttpTestingController;
    let router: Router;

    const registrationUrl = `${environment.securityApiUrl}/users`;

    const fillForm = (overrides: {
        username?: string,
        password?: string,
        firstName?: string,
        lastName?: string
    } = {}) => {
        component.registerForm.get('username')?.setValue(overrides.username ?? 'john');
        component.registerForm.get('password')?.setValue(overrides.password ?? 'secret');
        component.registerForm.get('firstName')?.setValue(overrides.firstName ?? 'John');
        component.registerForm.get('lastName')?.setValue(overrides.lastName ?? 'Doe');
    };

    const spyOnSnackBar = () => vi.spyOn(component.snackBar, 'open')
        .mockReturnValue(undefined as unknown as MatSnackBarRef<any>);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [MatSnackBarModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                RouterModule.forRoot(routes),
                NoopAnimationsModule,
                TranslateModule.forRoot()],
            providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
        vi.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build the form with the expected controls', () => {
        expect(Object.keys(component.registerForm.controls)).toEqual(['username', 'password', 'firstName', 'lastName']);
    });

    it('should start with an empty and invalid form', () => {
        expect(component.registerForm.get('username')?.value).toBe('');
        expect(component.registerForm.get('password')?.value).toBe('');
        expect(component.registerForm.get('firstName')?.value).toBe('');
        expect(component.registerForm.get('lastName')?.value).toBe('');
        expect(component.registerForm.valid).toBe(false);
    });

    it('should require the username and the password', () => {
        expect(component.registerForm.get('username')?.hasError('required')).toBe(true);
        expect(component.registerForm.get('password')?.hasError('required')).toBe(true);
        expect(component.registerForm.get('firstName')?.valid).toBe(true);
        expect(component.registerForm.get('lastName')?.valid).toBe(true);
    });

    it('should only accept alphanumeric usernames', () => {
        const username = component.registerForm.get('username');

        username?.setValue('user123');
        expect(username?.valid).toBe(true);
        expect(username?.errors).toBeNull();

        username?.setValue('user name');
        expect(username?.valid).toBe(false);
        expect(username?.errors?.['pattern']).toBeDefined();

        username?.setValue('user@name');
        expect(username?.valid).toBe(false);
        expect(username?.errors?.['pattern']).toBeDefined();
    });

    it('should only accept letters, dashes and apostrophes in the first and last name', () => {
        const firstName = component.registerForm.get('firstName');
        const lastName = component.registerForm.get('lastName');

        firstName?.setValue("O'Brien-Smith");
        lastName?.setValue('Doe');
        expect(firstName?.valid).toBe(true);
        expect(lastName?.valid).toBe(true);

        firstName?.setValue('John123');
        lastName?.setValue('Doe!');
        expect(firstName?.valid).toBe(false);
        expect(firstName?.errors?.['pattern']).toBeDefined();
        expect(lastName?.valid).toBe(false);
        expect(lastName?.errors?.['pattern']).toBeDefined();
    });

    it('should be valid once all the required fields are filled', () => {
        fillForm();

        expect(component.registerForm.valid).toBe(true);
    });

    it('register() should show an error and not send a request when the form is invalid', () => {
        const snackBarSpy = spyOnSnackBar();

        component.register();

        expect(snackBarSpy).toHaveBeenCalledWith(FAILED_MSG, CLOSE_KEY, {duration: DURATION});
        httpMock.expectNone(r => r.method === 'POST');
    });

    it('register() should send the entered data to the registration endpoint', () => {
        fillForm({username: 'jane', password: 'pass123', firstName: 'Jane', lastName: 'Smith'});

        component.register();

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url === registrationUrl);
        expect(req.request.body).toEqual({
            username: 'jane',
            password: 'pass123',
            firstName: 'Jane',
            lastName: 'Smith'
        });
        req.flush('user created');
    });

    it('register() should send empty optional names when they are not filled', () => {
        fillForm({firstName: '', lastName: ''});

        component.register();

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url === registrationUrl);
        expect(req.request.body).toEqual({
            username: 'john',
            password: 'secret',
            firstName: '',
            lastName: ''
        });
        req.flush('user created');
    });

    it('register() should navigate to the login page when the registration succeeds', () => {
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
        fillForm();

        component.register();
        httpMock.expectOne(r => r.method === 'POST' && r.url === registrationUrl).flush('user created');

        expect(navigateSpy).toHaveBeenCalledWith(['/security/login']);
    });

    it('register() should show an error and not navigate when the registration fails', () => {
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
        const snackBarSpy = spyOnSnackBar();
        fillForm();

        component.register();
        httpMock.expectOne(r => r.method === 'POST' && r.url === registrationUrl)
            .flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(snackBarSpy).toHaveBeenCalledWith(FAILED_MSG, CLOSE_KEY, {duration: DURATION});
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should disable the submit button while the form is invalid', () => {
        const button = fixture.nativeElement.querySelector('button.register-button') as HTMLButtonElement;

        expect(button.disabled).toBe(true);
    });

    it('should enable the submit button once the form is valid', () => {
        fillForm();
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button.register-button') as HTMLButtonElement;

        expect(button.disabled).toBe(false);
    });

    it('should show the validation errors of the empty required fields', () => {
        component.registerForm.get('username')?.markAsTouched();
        component.registerForm.get('password')?.markAsTouched();
        fixture.detectChanges();

        const errors = fixture.nativeElement.querySelectorAll('mat-error');

        expect(errors.length).toBe(2);
        expect(errors[0].textContent).toContain('username required');
        expect(errors[1].textContent).toContain('password required');
    });

    it('should show the validation errors of the invalid names', () => {
        component.registerForm.get('firstName')?.setValue('John123');
        component.registerForm.get('lastName')?.setValue('Doe123');
        component.registerForm.get('firstName')?.markAsTouched();
        component.registerForm.get('lastName')?.markAsTouched();
        fixture.detectChanges();

        const errors = fixture.nativeElement.querySelectorAll('mat-error');

        expect(errors.length).toBe(2);
        expect(errors[0].textContent).toContain('first name invalid');
        expect(errors[1].textContent).toContain('last name invalid');
    });

    it('should register when the submit button is clicked', () => {
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
        fillForm();
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button.register-button') as HTMLButtonElement;
        button.click();

        httpMock.expectOne(r => r.method === 'POST' && r.url === registrationUrl).flush('user created');

        expect(navigateSpy).toHaveBeenCalledWith(['/security/login']);
    });
});
