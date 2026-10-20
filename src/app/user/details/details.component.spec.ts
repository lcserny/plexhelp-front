import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsComponent} from './details.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {DatePipe} from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [DetailsComponent],
    imports: [MatSnackBarModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot(routes),
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule],
    providers: [DatePipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
