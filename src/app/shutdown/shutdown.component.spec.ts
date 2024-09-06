import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DURATION, FAILED_MSG, ShutdownComponent, SUCCESS_MSG} from './shutdown.component';
// Http testing module and mocking controller
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
// Other imports
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {CommandResponse, Status} from "../generated";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../environments/environment.test";

let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

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
                ReactiveFormsModule
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
        let resp: CommandResponse = {status: Status.SUCCESS};
        request.flush(resp);

        expect(component.snackBar.open).toHaveBeenCalledWith(SUCCESS_MSG.replace("{0}", "Shutdown"), "Close", {duration: DURATION});

        component.shutdown();

        request = httpTestingController.expectOne(url);
        resp = {status: Status.FAILED};
        request.flush(resp);

        expect(component.snackBar.open).toHaveBeenCalledWith(FAILED_MSG.replace("{0}", "Shutdown"), "Close", {duration: DURATION});
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
