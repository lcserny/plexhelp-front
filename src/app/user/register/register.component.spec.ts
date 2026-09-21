import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TranslatePipe, provideTranslateService} from "@ngx-translate/core";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideTranslateService()],
            declarations: [RegisterComponent],
            imports: [
                HttpClientTestingModule,
                MatSnackBarModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                RouterModule.forRoot(routes),
                NoopAnimationsModule,
                TranslatePipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
