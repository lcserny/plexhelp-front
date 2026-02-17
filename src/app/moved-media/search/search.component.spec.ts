import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaSearchComponent} from './search.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('SearchComponent', () => {
    let component: MovedMediaSearchComponent;
    let fixture: ComponentFixture<MovedMediaSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaSearchComponent],
            imports: [
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                HttpClientTestingModule,
                FormsModule,
                MatInputModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatIconModule,
                MatSelectModule
            ],
            providers: [DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(MovedMediaSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
