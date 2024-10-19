import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListComponent} from './list.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {routes} from "../../routing/routing.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ListComponent
            ],
            imports: [
                HttpClientTestingModule,
                MatSnackBarModule,
                TranslateModule.forRoot(),
                RouterModule.forRoot(routes),
                NoopAnimationsModule,
                MatPaginatorModule,
                MatTableModule,
                ReactiveFormsModule,
                MatInputModule,
                MatButtonModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
