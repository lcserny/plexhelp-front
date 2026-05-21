import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NavigationStart, Router} from "@angular/router";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Subject, of} from "rxjs";

import {SearchComponent, SearchItem} from './search.component';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let httpMock: HttpTestingController;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;
    let routerEventsSubject: Subject<any>;

    beforeEach(async () => {
        routerEventsSubject = new Subject<Event>();
        mockRouter = jasmine.createSpyObj('Router', ['navigate'], {events: routerEventsSubject.asObservable()});
        mockRouter.navigate.and.returnValue(Promise.resolve(true));

        mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);
        mockBottomSheet.open.and.returnValue({
            afterDismissed: () => of(undefined as any),
            dismiss: () => {}
        } as any);

        await TestBed.configureTestingModule({
            declarations: [SearchComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                MatSnackBarModule,
                MatPaginatorModule,
                MatSlideToggleModule,
                MatCardModule,
                MatButtonModule,
                MatTooltipModule,
                NoopAnimationsModule,
            ],
            providers: [
                {provide: Router, useValue: mockRouter},
                {provide: MatBottomSheet, useValue: mockBottomSheet},
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();

        const mediaReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/media-searches'));
        mediaReq.flush([]);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default configuration values', () => {
        expect(component.pageSizeOptions).toEqual([10, 20, 50]);
        expect(component.defaultPageSize).toBe(10);
        expect(component.searchPerformed).toBeTrue();
        expect(component.searchItems).toEqual([]);
        expect(component.totalItems).toBe(0);
    });

    it('should fetch media and downloaded data on initSearch', () => {
        component.initSearch();

        const mediaReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/media-searches'));
        const mockGroups = [
            {path: '/movies', name: 'Movie 1', videos: ['file1.mkv'], noParent: true},
            {path: '/tv', name: 'Show 1', videos: ['ep1.mkv'], season: 1},
        ];
        mediaReq.flush(mockGroups);

        const downloadReq = httpMock.expectOne(r => r.method === 'POST' && r.url.includes('/media-downloads'));
        const mockDownloads = [
            {id: '1', fileName: 'file1.mkv', fileSize: 100, dateDownloaded: '12345', downloadComplete: true, triedAutoMove: false},
        ];
        downloadReq.flush(mockDownloads);

        expect(component.searchItems.length).toBe(2);
        expect(component.searchItems[0].downloaded).toBeTrue();
        expect(component.searchItems[1].downloaded).toBeFalse();
        expect(component.totalItems).toBe(2);
        expect(component.searchPerformed).toBeTrue();
    });

    it('should show snackbar error when searchMedia fails', () => {
        spyOn(component['snackBar'], 'open');

        component.initSearch();

        const mediaReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/media-searches'));
        mediaReq.flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(component['snackBar'].open).toHaveBeenCalled();
        expect(component.searchPerformed).toBeFalse();
    });

    it('should show snackbar error when searchDownloadedMedia fails', () => {
        spyOn(component['snackBar'], 'open');

        component.initSearch();

        const mediaReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/media-searches'));
        mediaReq.flush([
            {path: '/movies', name: 'Movie 1', videos: ['file1.mkv'], noParent: true},
        ]);

        const downloadReq = httpMock.expectOne(r => r.method === 'POST' && r.url.includes('/media-downloads'));
        downloadReq.flush('Error', {status: 500, statusText: 'Internal Server Error'});

        expect(component['snackBar'].open).toHaveBeenCalled();
    });

    it('should handle empty groups without making download request', () => {
        component.initSearch();

        const mediaReq = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/media-searches'));
        mediaReq.flush([]);

        expect(component.searchItems).toEqual([]);
        expect(component.totalItems).toBe(0);
        expect(component.searchPerformed).toBeTrue();
    });

    it('save page size to localStorage and adjust view on page change', () => {
        spyOn(localStorage, 'setItem');

        component.searchItems = [
            {index: 0, group: {} as any, checked: false, downloaded: false},
            {index: 1, group: {} as any, checked: false, downloaded: false},
            {index: 2, group: {} as any, checked: false, downloaded: false},
        ];
        component.totalItems = 3;

        const event = {pageIndex: 1, pageSize: 2, length: 3};
        component.onPageChange(event);

        expect(localStorage.setItem).toHaveBeenCalledWith('vm-front-search-perPage', '2');
        expect(component.currentIndex).toBe(2);
        expect(component.currentPage.length).toBe(1);
    });

    it('toggleMedia should toggle item checked state and update count', () => {
        component.searchItems = [
            {index: 0, group: {} as any, checked: false, downloaded: true},
            {index: 1, group: {} as any, checked: false, downloaded: true},
        ];

        component.toggleMedia(true, 0);

        expect(component.searchItems[0].checked).toBeTrue();
        expect(component.searchItems[1].checked).toBeFalse();
        expect(component.toggledItemsCount).toBe(1);
    });

    it('toggleMedia should open bottom sheet when item is checked', () => {
        component.searchItems = [
            {index: 0, group: {} as any, checked: false, downloaded: true},
        ];

        component.toggleMedia(true, 0);

        expect(mockBottomSheet.open).toHaveBeenCalled();
    });

    it('toggleMedia should close bottom sheet when no items are checked', () => {
        spyOn(component, 'closeButtonsSheet');

        component.searchItems = [
            {index: 0, group: {} as any, checked: false, downloaded: true},
        ];

        component.toggleMedia(true, 0);
        expect(component.toggledItemsCount).toBe(1);

        component.toggleMedia(false, 0);
        expect(component.toggledItemsCount).toBe(0);
        expect(component.closeButtonsSheet).toHaveBeenCalled();
    });

    it('clearToggles should clear all checked states', () => {
        component.searchItems = [
            {index: 0, group: {} as any, checked: true, downloaded: true},
            {index: 1, group: {} as any, checked: true, downloaded: true},
        ];
        component.toggledItemsCount = 2;

        component.clearToggles();

        expect(component.searchItems[0].checked).toBeFalse();
        expect(component.searchItems[1].checked).toBeFalse();
        expect(component.toggledItemsCount).toBe(0);
    });

    it('goToSingleMediaDetails should navigate with single item', () => {
        const group = {path: '/movies', name: 'Test Movie', videos: ['file.mkv'], noParent: true};
        component.searchItems = [{index: 0, group, checked: false, downloaded: true}];

        component.goToSingleMediaDetails(0);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/media-detail'], {state: {items: [group]}});
    });

    it('goToMultipleMediaDetails should navigate with checked items', () => {
        const group1 = {path: '/movies', name: 'Movie 1', videos: ['f1.mkv'], noParent: true};
        const group2 = {path: '/movies', name: 'Movie 2', videos: ['f2.mkv'], noParent: true};
        component.searchItems = [
            {index: 0, group: group1, checked: true, downloaded: true},
            {index: 1, group: group2, checked: false, downloaded: true},
        ];

        component.goToMultipleMediaDetails();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/media-detail'], {state: {items: [group1]}});
    });

    it('adminForceToggle should toggle downloaded with shift+alt+ctrl', () => {
        const item: SearchItem = {index: 0, group: {} as any, checked: false, downloaded: false};
        const event = {shiftKey: true, altKey: true, ctrlKey: true} as MouseEvent;

        component.adminForceToggle(event, item);

        expect(item.downloaded).toBeTrue();
    });

    it('adminForceToggle should not toggle without modifier keys', () => {
        const item: SearchItem = {index: 0, group: {} as any, checked: false, downloaded: false};
        const event = {shiftKey: false, altKey: false, ctrlKey: false} as MouseEvent;

        component.adminForceToggle(event, item);

        expect(item.downloaded).toBeFalse();
    });

    it('should close buttons sheet on navigation start', () => {
        spyOn(component, 'closeButtonsSheet');
        component.bottomSheetRef = {} as any;

        routerEventsSubject.next(new NavigationStart(0, '/some-url'));

        expect(component.closeButtonsSheet).toHaveBeenCalled();
    });

    it('setItems should paginate when totalItems exceeds pageSize', () => {
        const groups = Array.from({length: 25}, (_, i) => ({
            path: `/movies/${i}`, name: `Movie ${i}`, videos: [`f${i}.mkv`], noParent: true
        }));

        component['setItems'](
            groups.map((g, i) => ({group: g, names: g.videos})),
            []
        );

        expect(component.totalItems).toBe(25);
        expect(component.currentPage.length).toBe(10);
        expect(component.currentIndex).toBe(0);
    });

    it('should unsubscribe from router events on destroy', () => {
        const subscription = component['routerSubscription'];
        spyOn(subscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
    });
});
