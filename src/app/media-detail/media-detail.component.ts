import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { MediaDetailOptionsComponent } from '../media-detail-options/media-detail-options.component';
import { MediaService } from '../media.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MediaFileGroup} from "../generated/commander/model/mediaFileGroup";
import {MediaFileType} from "../generated/commander/model/mediaFileType";
import {RenamedMediaOptions} from "../generated/commander/model/renamedMediaOptions";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-media-detail',
    templateUrl: './media-detail.component.html',
    styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

    private static MOVE_SUCCESS_KEY = "successfully moved media";
    private static MOVE_FAILED_KEY = "failed move media";
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
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        const idx = Number(this.route.snapshot.paramMap.get("idx"));
        this.mediaFileGroup = this.mediaService.getMediaFileGroup(idx);
    }

    goBack(): void {
        this.location.back();
    }

    generateTVName(name: string): void {
        this.type = "TV";
        this.mediaService.generateNameOptions(name, this.type)
            .subscribe(opts => this.handleOptionsSheet(opts));
    }

    generateMovieName(name: string): void {
        this.type = "MOVIE";
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
                    const msg = this.translateService.instant(MediaDetailComponent.MOVE_FAILED_KEY);
                    this.snackBar.open(msg, "Close", {
                        duration: MediaDetailComponent.DURATION
                    });
                } else {
                    const msg = this.translateService.instant(MediaDetailComponent.MOVE_SUCCESS_KEY);
                    this.snackBar.open(msg, "Close", {
                        duration: MediaDetailComponent.DURATION
                    });
                    this.goBack()
                }
            });
    }
}
