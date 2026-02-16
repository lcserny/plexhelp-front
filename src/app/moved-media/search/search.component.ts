import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'movedMedia-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class MovedMediaSearchComponent implements OnInit, AfterViewInit {

    @ViewChild('searchInput') searchInput!: ElementRef;
    searchText: string = "";

    movedMediaList: MovedMediaView[] = [];

    // TODO main page, only this one has search field and order options

    constructor(private movedMediaService: MovedMediaService, private router: Router, private datePipe: DatePipe) {}

    async ngOnInit() {
        await this.refreshMedia();
    }

    ngAfterViewInit() {
        this.focusOnSearch();
    }

    private focusOnSearch() {
        this.searchInput.nativeElement.focus();
    }

    async refreshMedia() {
        this.searchText = "";
        await this.movedMediaService.refreshMovedMedia();
        this.movedMediaList = this.movedMediaService.getAllMovedMedia();
        this.focusOnSearch();
    }

    generateTitle(media: MovedMediaView): string {
        return media.title + (media.date ? ` (${this.formatDate(media.date)})` : "");
    }

    generateCast(cast: string[]): string {
        return cast.join(", ");
    }

    formatDate(date: Date): string {
        return this.datePipe.transform(date, environment.region.dateFormat)!;
    }

    async filterMedia() {
        if (this.searchText.length >= 3) {
            await this.movedMediaService.refreshMovedMedia();
            this.movedMediaList = this.movedMediaService.getAllMovedMedia(this.searchText);
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
