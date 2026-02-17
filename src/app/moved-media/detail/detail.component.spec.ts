import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaDetailComponent} from './detail.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";

describe('DetailComponent', () => {
    let component: MovedMediaDetailComponent;
    let fixture: ComponentFixture<MovedMediaDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaDetailComponent],
            imports: [
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                HttpClientTestingModule
            ],
            providers: [DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(MovedMediaDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
