import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaDetailOptionsComponent} from './media-detail-options.component';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatListModule, MatNavList} from "@angular/material/list";

describe('MediaDetailOptionsComponent', () => {
    let component: MediaDetailOptionsComponent;
    let fixture: ComponentFixture<MediaDetailOptionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MediaDetailOptionsComponent],
            providers: [
                { provide: MatBottomSheetRef, useValue: {} },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
            ],
            imports: [MatListModule]
        }).compileComponents();

        fixture = TestBed.createComponent(MediaDetailOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
