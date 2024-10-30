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
import {CLOSE_KEY, DURATION} from "../app.component";

@Component({
    selector: 'app-media-detail',
    templateUrl: './media-detail.component.html',
    styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {

    private static MOVE_SUCCESS_KEY = "successfully moved media";
    private static MOVE_FAILED_KEY = "failed move media";

    mediaFileGroup?: MediaFileGroup;
    type?: MediaFileType;
    finalName?: string;

    season: string = "1";

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
        this.season = String(this.mediaFileGroup?.season || 1);
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
        this.mediaFileGroup!.season = parseInt(this.season!);

        this.mediaService.moveMedia(this.mediaFileGroup!, this.type!)
            .subscribe(errors => {
                if (MediaService.isNotEmptyArray(errors)) {
                    this.showPopup(this.translateService.instant(MediaDetailComponent.MOVE_FAILED_KEY));
                } else {
                    this.showPopup(this.translateService.instant(MediaDetailComponent.MOVE_SUCCESS_KEY));
                    this.goBack()
                }
            });
    }

    private showPopup(message: string) {
        const closeMsg = this.translateService.instant(CLOSE_KEY);
        this.snackBar.open(message, closeMsg, { duration: DURATION });
    }
}
