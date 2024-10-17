import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
    SHUTDOWN_FAILED_KEY, SHUTDOWN_SUCCESS_KEY,
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

describe('ShutdownComponent', () => {
    let component: ShutdownComponent;
    let fixture: ComponentFixture<ShutdownComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

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

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(ShutdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("shutdown should show popup toast", () => {
        spyOn(component.snackBar, 'open');

        component.shutdown();

        const url = `${environment.commanderApiUrl}/commands`;
        let request = httpTestingController.expectOne(url);
        let resp: CommandResponse = {status: "SUCCESS"};
        request.flush(resp);

        expect(component.snackBar.open).toHaveBeenCalledWith(SHUTDOWN_SUCCESS_KEY, CLOSE_KEY, {duration: DURATION});

        component.shutdown();

        request = httpTestingController.expectOne(url);
        resp = {status: "FAILED"};
        request.flush(resp);

        expect(component.snackBar.open).toHaveBeenCalledWith(SHUTDOWN_FAILED_KEY, CLOSE_KEY, {duration: DURATION});
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
