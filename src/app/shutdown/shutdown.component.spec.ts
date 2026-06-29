import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
    SHUTDOWN_FAILED_KEY, SHUTDOWN_SUCCESS_KEY,
    RESTART_FAILED_KEY, RESTART_SUCCESS_KEY,
    SLEEP_FAILED_KEY, SLEEP_SUCCESS_KEY,
    SERVICE_RESTART_SUCCESS_KEY, SERVICE_RESTART_FAILED_KEY,
    PROVIDE_SERVICE_NAME_KEY,
    ShutdownComponent,
} from './shutdown.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../environments/environment.test";
import {CommandResponse} from "../generated/commander/model/commandResponse";
import {TranslateModule} from "@ngx-translate/core";
import {CLOSE_KEY, DURATION} from "../app.component";
import {LoadingService} from "../loading.service";

describe('ShutdownComponent', () => {
    let component: ShutdownComponent;
    let fixture: ComponentFixture<ShutdownComponent>;
    let httpTestingController: HttpTestingController;

    const commandsUrl = `${environment.commanderApiUrl}/commands`;
    const pingUrl = `${environment.commanderApiUrl}/ping`;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShutdownComponent],
            imports: [
                HttpClientTestingModule,
                MatSnackBarModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                TextFieldModule,
                MatInputModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
        }).compileComponents();

        TestBed.inject(HttpClient);
        TestBed.inject(LoadingService).setLoading(false);
        httpTestingController = TestBed.inject(HttpTestingController);

        localStorage.clear();
        fixture = TestBed.createComponent(ShutdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('shutdown', () => {
        it('should show success popup when server goes down', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.shutdown();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).error(new ProgressEvent('network error'));

            expect(component.snackBar.open).toHaveBeenCalledWith(SHUTDOWN_SUCCESS_KEY, CLOSE_KEY, {duration: DURATION});
        }));

        it('should show failure popup when server stays up', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.shutdown();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).flush(null, {status: 200, statusText: 'OK'});

            expect(component.snackBar.open).toHaveBeenCalledWith(SHUTDOWN_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        }));
    });

    describe('reboot', () => {
        it('should show success popup when server goes down', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.reboot();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).error(new ProgressEvent('network error'));

            expect(component.snackBar.open).toHaveBeenCalledWith(RESTART_SUCCESS_KEY, CLOSE_KEY, {duration: DURATION});
        }));

        it('should show failure popup when server stays up', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.reboot();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).flush(null, {status: 200, statusText: 'OK'});

            expect(component.snackBar.open).toHaveBeenCalledWith(RESTART_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        }));
    });

    describe('sleep', () => {
        it('should show success popup when server goes down', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.sleep();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).error(new ProgressEvent('network error'));

            expect(component.snackBar.open).toHaveBeenCalledWith(SLEEP_SUCCESS_KEY, CLOSE_KEY, {duration: DURATION});
        }));

        it('should show failure popup when server stays up', fakeAsync(() => {
            spyOn(component.snackBar, 'open');
            component.sleep();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);
            tick(1000);
            httpTestingController.expectOne(pingUrl).flush(null, {status: 200, statusText: 'OK'});

            expect(component.snackBar.open).toHaveBeenCalledWith(SLEEP_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        }));
    });

    describe('restartService', () => {
        it('should show success popup when command succeeds', () => {
            spyOn(component.snackBar, 'open');
            component.serviceForm.get('serviceName')?.setValue('nginx');
            component.restartService();

            httpTestingController.expectOne(commandsUrl).flush({status: "SUCCESS"} as CommandResponse);

            expect(component.snackBar.open).toHaveBeenCalledWith(SERVICE_RESTART_SUCCESS_KEY, CLOSE_KEY, {duration: DURATION});
        });

        it('should show failure popup on HTTP error', () => {
            spyOn(component.snackBar, 'open');
            component.serviceForm.get('serviceName')?.setValue('nginx');
            component.restartService();

            httpTestingController.expectOne(commandsUrl).error(new ProgressEvent('network error'));

            expect(component.snackBar.open).toHaveBeenCalledWith(SERVICE_RESTART_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
        });

        it('should show prompt popup when service name is empty', () => {
            spyOn(component.snackBar, 'open');
            component.restartService();

            expect(component.snackBar.open).toHaveBeenCalledWith(PROVIDE_SERVICE_NAME_KEY, CLOSE_KEY, {duration: DURATION});
        });
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
