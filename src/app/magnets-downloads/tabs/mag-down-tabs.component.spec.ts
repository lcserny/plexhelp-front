import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MagDownTabsComponent} from './mag-down-tabs.component';
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {MagnetsListComponent} from "../../magnets/list/magnets-list.component";
import {DownloadsListComponent} from "../../downloads/list/downloads-list.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {CustomDateAdapter} from "../../app.component";

describe('TabsComponent', () => {
    let component: MagDownTabsComponent;
    let fixture: ComponentFixture<MagDownTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                MagnetsListComponent,
                DownloadsListComponent,
                MagDownTabsComponent
            ],
            imports: [
                RouterModule.forRoot(routes),
                MatTabsModule,
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
                NoopAnimationsModule,
                MatDatepickerModule,
                MatCheckboxModule,
                MatNativeDateModule
            ],
            providers: [DatePipe, {provide: DateAdapter, useClass: CustomDateAdapter}]
        }).compileComponents();

        fixture = TestBed.createComponent(MagDownTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
