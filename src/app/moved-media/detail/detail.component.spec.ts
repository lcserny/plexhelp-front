import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovedMediaDetailComponent} from './detail.component';
import {TranslatePipe, provideTranslateService} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";

describe('DetailComponent', () => {
    let component: MovedMediaDetailComponent;
    let fixture: ComponentFixture<MovedMediaDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MovedMediaDetailComponent],
            imports: [
                TranslatePipe,
                RouterModule.forRoot(routes),
                HttpClientTestingModule,
                MatDialogModule
            ],
            providers: [provideTranslateService(), DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(MovedMediaDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
