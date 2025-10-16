import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                MatPaginatorModule,
                MatBottomSheetModule,
                MatSnackBarModule,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
