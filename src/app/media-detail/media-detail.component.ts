import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
    type?: MediaFileType;
    finalName?: string;

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
        this.type = MediaFileType.TV;
        this.mediaService.generateNameOptions(name, this.type)
            .subscribe(opts => this.handleOptionsSheet(opts));
    }

    generateMovieName(name: string): void {
        this.type = MediaFileType.MOVIE;
        this.mediaService.generateNameOptions(name, this.type)
            .subscribe(opts => this.handleOptionsSheet(opts));
    }

    handleOptionsSheet(opts: RenamedMediaOptions): void {
        this.bottomSheet.open(MediaDetailOptionsComponent, { data: opts })
            .afterDismissed().subscribe(mediaName => {
                if (mediaName) {
                    this.finalName = mediaName;
                }
            });
    }

    moveMedia(): void {
        // TODO: move using service and in subscribe use goBack()
        this.goBack();
    }
}
