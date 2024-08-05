import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaDetailComponent} from './media-detail.component';
import {RouterModule} from "@angular/router";
import {routes} from "../routing/routing.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('MediaDetailComponent', () => {
    let component: MediaDetailComponent;
    let fixture: ComponentFixture<MediaDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MediaDetailComponent],
            imports: [RouterModule.forRoot(routes), HttpClientTestingModule, MatSnackBarModule],
            providers: [
                { provide: MatBottomSheet, useValue: {} },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MediaDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
