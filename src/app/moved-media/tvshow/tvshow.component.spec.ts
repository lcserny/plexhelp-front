import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaTVShowComponent} from './tvshow.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {DatePipe} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";

describe('TvshowComponent', () => {
    let component: MovedMediaTVShowComponent;
    let fixture: ComponentFixture<MovedMediaTVShowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaTVShowComponent],
            imports: [
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                HttpClientTestingModule,
                MatDialogModule
            ],
            providers: [DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(MovedMediaTVShowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
