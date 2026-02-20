import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MovedMediaService, MovedMediaView, SortData, sortOptions} from "../moved-media.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
    selector: 'movedMedia-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class MovedMediaSearchComponent implements OnInit {

    @ViewChild('searchInput') searchInput!: ElementRef;
    searchText: string = "";

    sortOptions: SortData[] = sortOptions;
    selectedSort: SortData = sortOptions[0];

    movedMediaList: MovedMediaView[] = [];

    constructor(private movedMediaService: MovedMediaService) {}

    async ngOnInit() {
        await this.refreshMedia();
    }

    async refreshMedia() {
        this.searchText = "";
        await this.movedMediaService.refreshMovedMedia();
        this.movedMediaList = this.movedMediaService.getAllMovedMedia(this.selectedSort);
    }

    generateTitle(media: MovedMediaView): string {
        return this.movedMediaService.generateTitle(media);
    }

    async onSortChange(event: MatSelectChange) {
        this.selectedSort = event.value;
        await this.refreshMedia();
    }

    async filterMedia() {
        if (this.searchText.length >= 3) {
            await this.movedMediaService.refreshMovedMedia();
            this.movedMediaList = this.movedMediaService.getAllMovedMedia(this.selectedSort, this.searchText);
        } else if (this.searchText.length == 0) {
            await this.refreshMedia();
        }
    }

    generateLink(media: MovedMediaView): string {
        switch (media.type) {
            case "MOVIE":
                return `/moved-media/detail/${media.id}`;
            case "TV":
                return `/moved-media/tv-show/${media.id}`;
        }
    }
}
