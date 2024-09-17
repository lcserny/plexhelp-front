import { Component, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import {MediaFileGroup} from "../generated/commander/model/mediaFileGroup";

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
