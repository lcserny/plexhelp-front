import { Component, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import {MediaFileGroup} from "../generated/commander/model/mediaFileGroup";
import {PageEvent} from "@angular/material/paginator";
import {environment} from "../../environments/environment";

const SEARCH_PER_PAGE_KEY = "vm-front-search-perPage";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    private mediaFileGroups: MediaFileGroup[] = [];

    pageSizeOptions = environment.mediaSearchPageSizeOptions;
    defaultPageSize = Number(localStorage.getItem(SEARCH_PER_PAGE_KEY) || this.pageSizeOptions[0]);
    searchPerformed = false;
    currentPageStartIndex = 0;
    currentPageMediaFileGroups: MediaFileGroup[] = [];
    totalItems = 0;

    constructor(private mediaService: MediaService) {}

    ngOnInit(): void {
        this.initSearch();
    }

    initSearch(): void {
        this.searchPerformed = false;
        this.mediaService.searchMedia().subscribe(mfg => {
            this.mediaFileGroups = mfg;
            this.searchPerformed = true;
            this.totalItems = mfg.length;

            this.adjustView(0, this.defaultPageSize);
        });
    }

    onPageChange(event: PageEvent) {
        localStorage.setItem(SEARCH_PER_PAGE_KEY, String(event.pageSize));
        this.adjustView(event.pageIndex, event.pageSize);
    }

    private adjustView(page: number, perPage: number) {
        const startIndex = page === 0 ? 0 : page * perPage;
        const endIndex = Math.min(startIndex + perPage, this.totalItems);

        this.currentPageStartIndex = startIndex;
        this.currentPageMediaFileGroups = this.mediaFileGroups.slice(startIndex, endIndex);
    }
}
