import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { MediaFileGroup, RenamedMediaOptions } from '../generated';
import { MediaFileType } from '../generated/models/MediaFileType';
import { MediaDetailOptionsComponent } from '../media-detail-options/media-detail-options.component';
import { MediaService } from '../media.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-media-detail',
    templateUrl: './media-detail.component.html',
    styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

    private static MOVE_SUCCESS = "Successfully moved media!";
    private static MOVE_FAILED = "Failed to move media, check messages!";
    private static DURATION = 5000;

    mediaFileGroup?: MediaFileGroup;
    type?: MediaFileType;
    finalName?: string;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mediaService: MediaService,
        private bottomSheet: MatBottomSheet,
        private snackBar: MatSnackBar,
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
        this.mediaFileGroup!.name = this.finalName!;
        this.mediaService.moveMedia(this.mediaFileGroup!, this.type!)
            .subscribe(errors => {
                if (MediaService.isNotEmptyArray(errors)) {
                    this.snackBar.open(MediaDetailComponent.MOVE_FAILED, "Close", {
                        duration: MediaDetailComponent.DURATION
                    });
                } else {
                    this.snackBar.open(MediaDetailComponent.MOVE_SUCCESS, "Close", {
                        duration: MediaDetailComponent.DURATION
                    });
                    this.goBack()
                }
            });
    }
}
