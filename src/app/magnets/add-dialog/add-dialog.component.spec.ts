import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDialogComponent} from './add-dialog.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TranslatePipe, provideTranslateService} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('AddDialogComponent', () => {
    let component: AddDialogComponent;
    let fixture: ComponentFixture<AddDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddDialogComponent],
            imports: [
                MatDialogModule,
                MatFormFieldModule,
                TranslatePipe,
                ReactiveFormsModule,
                MatInputModule,
                FormsModule,
                NoopAnimationsModule
            ],
            providers: [provideTranslateService(), 
                {provide: MatDialogRef, useValue: {}},
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
