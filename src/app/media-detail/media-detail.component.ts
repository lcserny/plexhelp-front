import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaFileGroup } from '../generated';
import { MediaFileType } from '../generated/models/MediaFileType';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-media-detail',
    templateUrl: './media-detail.component.html',
    styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

    mediaFileGroup?: MediaFileGroup;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mediaService: MediaService,
    ) { }

    ngOnInit(): void {
        const idx = Number(this.route.snapshot.paramMap.get("idx"));
        this.mediaFileGroup = this.mediaService.getMediaFileGroup(idx);
    }

    goBack(): void {
        this.location.back();
    }

    generateTVName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.TV)
            .subscribe(options => console.log(options));
    }

    generateMovieName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.MOVIE)
            .subscribe(options => console.log(options));
    }
}
