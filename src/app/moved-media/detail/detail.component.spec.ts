import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaDetailComponent} from './detail.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('DetailComponent', () => {
    let component: MovedMediaDetailComponent;
    let fixture: ComponentFixture<MovedMediaDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [MovedMediaDetailComponent],
    imports: [TranslateModule.forRoot(),
        RouterModule.forRoot(routes),
        MatDialogModule],
    providers: [DatePipe, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

        fixture = TestBed.createComponent(MovedMediaDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
