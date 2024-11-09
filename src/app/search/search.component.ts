import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MediaService } from '../media.service';
import {MediaFileGroup} from "../generated/commander/model/mediaFileGroup";
import {PageEvent} from "@angular/material/paginator";
import {environment} from "../../environments/environment";
import {NavigationStart, Router} from "@angular/router";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {group} from "@angular/animations";
import {OTHER_MEDIA_KEY} from "../media-detail/media-detail.component";

const SEARCH_PER_PAGE_KEY = "vm-front-search-perPage";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    private readonly routerSubscription: Subscription;

    searchItems: SearchItem[] = [];

    pageSizeOptions = environment.mediaSearchPageSizeOptions;
    defaultPageSize = Number(localStorage.getItem(SEARCH_PER_PAGE_KEY) || this.pageSizeOptions[0]);
    searchPerformed = false;
    currentIndex = 0;
    currentPage: SearchItem[] = [];
    totalItems = 0;

    toggledItemsCount = 0;
    bottomSheetRef?: MatBottomSheetRef<SearchButtonsComponent>;

    private readonly detailsText: string;
    private readonly otherMediaText: string;
    private readonly clearText: string;

    constructor(private mediaService: MediaService,
                private router: Router,
                private buttonsSheet: MatBottomSheet,
                private translateService: TranslateService) {
        this.detailsText = this.translateService.instant("details");
        this.otherMediaText = this.translateService.instant(OTHER_MEDIA_KEY);
        this.clearText = this.translateService.instant("reset");

        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.closeButtonsSheet();
            }
        });
    }

    ngOnInit(): void {
        this.initSearch();
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    initSearch(): void {
        this.searchPerformed = false;
        this.mediaService.searchMedia().subscribe(groups => {
            this.searchPerformed = true;
            this.searchItems = groups.map((group, index) => {
                return {index, group, checked: false};
            });
            this.totalItems = groups.length;
            this.adjustView(0, this.defaultPageSize);
        });
    }

    onPageChange(event: PageEvent) {
        localStorage.setItem(SEARCH_PER_PAGE_KEY, String(event.pageSize));
        this.adjustView(event.pageIndex, event.pageSize);
    }

    openButtonsSheet(): void {
        this.bottomSheetRef = this.buttonsSheet.open(SearchButtonsComponent, {
            disableClose: true,
            hasBackdrop: false,
            data: {detailsText: this.buildDetailsText(), clearText: this.clearText}
        });

        this.bottomSheetRef.afterDismissed().subscribe((action: SearchButtonsCommand) => {
            switch (action) {
                case "GO_TO_DETAILS":
                    this.goToToggledMediaDetails();
                    break;
                case "CLEAR":
                    this.clearToggles();
                    break;
            }
        });
    }

    private buildDetailsText(): string {
        return `${this.detailsText} (${this.toggledItemsCount} ${this.translateService.instant("media files")})`;
    }

    closeButtonsSheet() {
        if (this.bottomSheetRef) {
            this.bottomSheetRef.dismiss();
        }
    }

    goToMediaDetails(index: number) {
        this.router.navigate([`/media-detail`], {state: [this.searchItems[index].group]});
    }

    goToToggledMediaDetails() {
        const items = this.searchItems.filter(value => value.checked).map(value => value.group);
        this.router.navigate([`/media-detail`], {state: items});
    }

    toggleMedia(checked: boolean, index: number) {
        const item = this.searchItems.find(value => value.index === index);
        if (item) {
            item.checked = checked;
        }
        this.updateToggledItemsCount();
        this.toggleShowButtons();
    }

    clearToggles() {
        this.searchItems.forEach(value => value.checked = false);
        this.updateToggledItemsCount();
        this.toggleShowButtons();
    }

    private updateToggledItemsCount() {
        this.toggledItemsCount = this.searchItems.filter(value => value.checked).length;
    }

    private toggleShowButtons() {
        const showBottomSheet = !!this.searchItems.find(value => value.checked);
        if (showBottomSheet) {
            this.openButtonsSheet();
        } else {
            this.closeButtonsSheet();
        }
    }

    private adjustView(page: number, perPage: number) {
        const startIndex = page === 0 ? 0 : page * perPage;
        const endIndex = Math.min(startIndex + perPage, this.totalItems);

        this.currentIndex = startIndex;
        this.currentPage = this.searchItems.slice(startIndex, endIndex);
    }
}

export interface SearchItem {
    index: number;
    checked: boolean;
    group: MediaFileGroup;
}

@Component({
    selector: 'app-search-buttons',
    template: `
        <div class="search-button-container">
            <button mat-raised-button color="primary" (click)="execute('GO_TO_DETAILS')">{{data.detailsText}}</button>
            <button mat-raised-button (click)="execute('CLEAR')">{{data.clearText}}</button>
        </div>
    `,
    styles: [
        `.search-button-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }`,
        `button {
            width: 100%;
        }`
    ],
    standalone: true,
    imports: [MatButtonModule],
})
export class SearchButtonsComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<SearchButtonsComponent>,
                @Inject(MAT_BOTTOM_SHEET_DATA) public data: ButtonsSheetData) {}

    execute(action: SearchButtonsCommand): void {
        this.bottomSheetRef.dismiss(action);
    }
}

export type SearchButtonsCommand = "CLEAR" | "GO_TO_DETAILS";

export interface ButtonsSheetData {
    detailsText: string;
    clearText: string;
}
