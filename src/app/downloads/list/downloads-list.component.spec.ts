import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
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
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {CustomDateAdapter, booleanValidator} from "../../app.component";

import {DownloadsListComponent} from './downloads-list.component';
import {environment} from "../../../environments/environment";

describe('DownloadsListComponent', () => {
    let component: DownloadsListComponent;
    let fixture: ComponentFixture<DownloadsListComponent>;
    let httpMock: HttpTestingController;

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
                MatNativeDateModule
            ],
            providers: [
                DatePipe,
                {provide: DateAdapter, useClass: CustomDateAdapter}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadsListComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();

        const initialReq = httpMock.expectOne(r =>
            r.method === 'POST' &&
            r.url.includes('/media-downloads/paginated')
        );
        initialReq.flush({content: [], page: {size: 20, number: 0, totalElements: 0, totalPages: 0}});
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form controls with default values', () => {
        expect(component.downloadsForm.get('date')).toBeDefined();
        expect(component.downloadsForm.get('fileName')).toBeDefined();
        expect(component.downloadsForm.get('downloaded')).toBeDefined();

        expect(component.downloadsForm.get('date')?.value).toBeNull();
        expect(component.downloadsForm.get('fileName')?.value).toBe('');
        expect(component.downloadsForm.get('downloaded')?.value).toBeTrue();
    });

    it('should have correct default configuration values', () => {
        expect(component.defaultSort).toEqual(['dateDownloaded,DESC']);
        expect(component.displayedColumns).toEqual(['id', 'fileName', 'fileSize', 'dateDownloaded', 'downloadComplete']);
        expect(component.pageSizeOptions).toEqual(environment.pageSizeOptions.downloads);
        expect(component.defaultPageSize).toBe(environment.pageSizeOptions.downloads[1]);
        expect(component.totalItems).toBe(0);
        expect(component.dataSource.data).toEqual([]);
    });

    it('should validate text control with pattern', () => {
        const control = component.produceTextControl();
        expect(control.valid).toBeTrue();
        expect(control.errors).toBeNull();

        control.setValue('valid-name-123');
        expect(control.valid).toBeTrue();

        control.setValue('invalid@chars!');
        expect(control.valid).toBeFalse();
        expect(control.errors?.['pattern']).toBeDefined();
    });

    it('should validate date control with dateValidator', () => {
        const control = component.produceDateControl();
        expect(control.valid).toBeTrue();

        control.setValue(new Date());
        expect(control.valid).toBeTrue();

        control.setValue('invalid date string' as any);
        expect(control.valid).toBeFalse();
        expect(control.errors?.['invalidDate']).toBeDefined();
    });

    it('should create checkmark control with initial value true', () => {
        const control = component.produceCheckmarkControl();
        expect(control.value).toBeTrue();
    });

    it('booleanValidator should validate boolean values', () => {
        const validator = booleanValidator();
        const control = {value: true} as any;
        expect(validator(control)).toBeNull();

        control.value = false;
        expect(validator(control)).toBeNull();

        control.value = 'not a boolean';
        expect(validator(control)).toEqual({notBoolean: true});
    });

    it('reset() should reset form controls to defaults and reload data', () => {
        component.downloadsForm.get('date')?.setValue(new Date());
        component.downloadsForm.get('fileName')?.setValue('test-file');
        component.downloadsForm.get('downloaded')?.setValue(false);

        spyOn(component, 'loadData');
        component.reset();

        expect(component.downloadsForm.get('date')?.value).toBeNull();
        expect(component.downloadsForm.get('fileName')?.value).toBe('');
        expect(component.downloadsForm.get('downloaded')?.value).toBeTrue();
        expect(component.loadData).toHaveBeenCalledWith(0, component.defaultPageSize, component.defaultSort);
    });

    it('search() should call loadData when form is valid', () => {
        spyOn(component, 'loadData');

        component.downloadsForm.get('fileName')?.setValue('valid-name');
        expect(component.downloadsForm.valid).toBeTrue();

        component.search();

        expect(component.loadData).toHaveBeenCalledWith(0, component.defaultPageSize, component.defaultSort);
    });

    it('search() should show snackbar error when form is invalid', () => {
        spyOn(component['snackBar'], 'open');

        component.downloadsForm.get('fileName')?.setValue('invalid@chars!');
        expect(component.downloadsForm.valid).toBeFalse();

        component.search();

        expect(component['snackBar'].open).toHaveBeenCalled();
    });

    it('loadData() should fetch paginated data and update dataSource and totalItems on success', () => {
        const mockContent = [
            {id: '1', fileName: 'file1.mkv', fileSize: 1048576, dateDownloaded: '1234567890', downloadComplete: true, triedAutoMove: false},
            {id: '2', fileName: 'file2.mkv', fileSize: 2097152, dateDownloaded: '1234567891', downloadComplete: false, triedAutoMove: false}
        ];
        const mockPage = {size: 20, number: 0, totalElements: 5, totalPages: 1};
        const mockResponse = {content: mockContent, page: mockPage};

        component.loadData(0, 20, component.defaultSort);

        const req = httpMock.expectOne(r =>
            r.method === 'POST' &&
            r.url.includes('/media-downloads/paginated') &&
            r.url.includes('page=0') &&
            r.url.includes('size=20')
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(component.dataSource.data).toEqual(mockContent);
        expect(component.totalItems).toBe(5);
    });

    it('loadData() should show snackbar error on failure', () => {
        spyOn(component['snackBar'], 'open');

        component.loadData(0, 20, component.defaultSort);

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url.includes('/media-downloads/paginated'));
        req.flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(component['snackBar'].open).toHaveBeenCalled();
    });

    it('onPageChange() should save page size to localStorage and load data', () => {
        spyOn(component, 'loadData');
        spyOn(localStorage, 'setItem');

        const event = {pageIndex: 2, pageSize: 50, length: 100};
        component.onPageChange(event);

        expect(localStorage.setItem).toHaveBeenCalledWith('vm-front-downloads-perPage', '50');
        expect(component.loadData).toHaveBeenCalledWith(2, 50, component.defaultSort);
    });

    it('formatDate() should return formatted date string when date is provided', () => {
        const timestamp = 1700000000;
        const result = component.formatDate(timestamp);
        const expectedFormat = environment.region.dateFormat + ' ' + environment.region.timeFormat;
        const expected = new DatePipe('en').transform(new Date(timestamp * 1000), expectedFormat) as string;
        expect(result).toBe(expected);
    });

    it('formatDate() should return noDateText when date is not provided', () => {
        expect(component.formatDate(undefined)).toBe(component.noDateText);
        expect(component.formatDate(0)).toBe(component.noDateText);
    });

    it('formatSize() should return formatted size string when size is provided', () => {
        expect(component.formatSize(1048576)).toBe('1.00 MB');
        expect(component.formatSize(2097152)).toBe('2.00 MB');
        expect(component.formatSize(1572864)).toBe('1.50 MB');
    });

    it('formatSize() should return empty string when size is not provided', () => {
        expect(component.formatSize(undefined)).toBe('');
        expect(component.formatSize(0)).toBe('');
    });
});
