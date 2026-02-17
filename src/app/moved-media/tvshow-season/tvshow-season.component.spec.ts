import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaTVShowSeasonComponent} from './tvshow-season.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";

describe('TvshowSeasonComponent', () => {
    let component: MovedMediaTVShowSeasonComponent;
    let fixture: ComponentFixture<MovedMediaTVShowSeasonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaTVShowSeasonComponent],
            imports: [
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                HttpClientTestingModule
            ],
            providers: [DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(MovedMediaTVShowSeasonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
