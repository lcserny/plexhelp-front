import { Component, OnInit } from '@angular/core';
import { MediaFileGroup, MediaFileType } from '../generated';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    searchPerformed = false;
    mediaFileGroups: MediaFileGroup[] = [];

    constructor(private mediaService: MediaService) {}

    ngOnInit(): void {
        this.initSearch();
    }

    initSearch(): void {
        this.searchPerformed = false;
        this.mediaService.searchMedia()
            .subscribe(mfg => {
                this.mediaFileGroups = mfg;
                this.searchPerformed = true;
            });
    }
}
