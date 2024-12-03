import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MagnetsListComponent} from './magnets-list.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ListComponent', () => {
    let component: MagnetsListComponent;
    let fixture: ComponentFixture<MagnetsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MagnetsListComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                MatSnackBarModule,
                MatDialogModule,
                MatIconModule,
                MatFormFieldModule,
                MatPaginatorModule,
                ReactiveFormsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                NoopAnimationsModule
            ],
            providers: [
                DatePipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MagnetsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
