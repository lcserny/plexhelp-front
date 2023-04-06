import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { MediaFileGroup, RenamedMediaOptions } from '../generated';
import { MediaFileType } from '../generated/models/MediaFileType';
import { MediaDetailOptionsComponent } from '../media-detail-options/media-detail-options.component';
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
        private bottomSheet: MatBottomSheet,
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
            // TODO: options are needed in the other component, maybe use a new shared service or reuse media service?
            .subscribe(options => {
                // send somewhere reachable by other comp
                this.bottomSheet.open(MediaDetailOptionsComponent);
            });
    }

    generateMovieName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.MOVIE)
            // TODO: options are needed in the other component, maybe use a new shared service or reuse media service?
            .subscribe(options => {
                // send somewhere reachable by other comp
                this.bottomSheet.open(MediaDetailOptionsComponent);
            });
    }
}
