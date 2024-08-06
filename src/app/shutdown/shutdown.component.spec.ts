import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DURATION, FAILED_MSG, ShutdownComponent, SUCCESS_MSG} from './shutdown.component';
// Http testing module and mocking controller
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
// Other imports
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommanderApiUrlResolver} from "../../environments/commander.resolver";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {CommandRequest, CommandResponse, Status} from "../generated";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

describe('ShutdownComponent', () => {
    let component: ShutdownComponent;
    let fixture: ComponentFixture<ShutdownComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let commanderResolver: CommanderApiUrlResolver;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShutdownComponent],
            imports: [HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule, MatFormFieldModule, TextFieldModule, MatInputModule, FormsModule],
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        commanderResolver = TestBed.inject(CommanderApiUrlResolver);

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

        const url = `${commanderResolver.produceCommanderApiUrlBase()}/v1/commands`;
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
