import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaTVShowComponent} from './tvshow.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";

describe('TvshowComponent', () => {
    let component: MovedMediaTVShowComponent;
    let fixture: ComponentFixture<MovedMediaTVShowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaTVShowComponent],
            imports: [
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                HttpClientTestingModule
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
