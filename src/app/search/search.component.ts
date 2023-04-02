import { Component, OnInit } from '@angular/core';
import { MediaFileGroup, MediaFileType } from '../generated';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    
    mediaFileGroups: MediaFileGroup[] = [];

    constructor(private mediaService: MediaService) {}

    ngOnInit(): void {
        this.initSearch();
    }

    initSearch(): void {
        this.mediaService.searchMedia()
            .subscribe(mfg => this.mediaFileGroups = mfg);
    }

    // TODO: move to media detail component
    generateTVName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.TV)
            .subscribe(options => console.log(options));
    }
    generateMovieName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.MOVIE)
            .subscribe(options => console.log(options));
    }
}
