import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadsListComponent} from './downloads-list.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {DatePipe} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserModule} from "@angular/platform-browser";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

describe('DownloadsListComponent', () => {
    let component: DownloadsListComponent;
    let fixture: ComponentFixture<DownloadsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DownloadsListComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                MatSnackBarModule,
                MatIconModule,
                MatFormFieldModule,
                MatPaginatorModule,
                ReactiveFormsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                BrowserModule,
                NoopAnimationsModule,
                MatCheckboxModule,
                MatDatepickerModule,
                MatMomentDateModule
            ],
            providers: [
                DatePipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
