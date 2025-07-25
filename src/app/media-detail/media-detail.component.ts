import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import { MediaDetailOptionsComponent } from '../media-detail-options/media-detail-options.component';
import {isNotEmptyArray, MediaService} from '../media.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MediaFileGroup} from "../generated/commander/model/mediaFileGroup";
import {MediaFileType} from "../generated/commander/model/mediaFileType";
import {RenamedMediaOptions} from "../generated/commander/model/renamedMediaOptions";
import {TranslateService} from "@ngx-translate/core";
import {CLOSE_KEY, DURATION} from "../app.component";

export const MOVE_SUCCESS_KEY = "successfully moved media";
export const MOVE_FAILED_KEY = "failed move media";
export const OTHER_MEDIA_KEY = "other media";

@Component({
    selector: 'app-media-detail',
    templateUrl: './media-detail.component.html',
    styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent {

    mainMediaFileGroup?: MediaFileGroup;
    allMediaFileGroups?: MediaFileGroup[] = [];
    type?: MediaFileType;
    finalName?: string;

    season = "";
    groupText = "";

    constructor(
        private router: Router,
        private location: Location,
        private mediaService: MediaService,
        private bottomSheet: MatBottomSheet,
        private snackBar: MatSnackBar,
        private translateService: TranslateService
    ) {
        // only available in constructor
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as MediaFileGroup[];
        if (state) {
            this.allMediaFileGroups = state;
            this.mainMediaFileGroup = this.allMediaFileGroups[0];
            this.season = String(this.mainMediaFileGroup?.season || "");
            this.initGroupText();
        }
    }

    private initGroupText() {
        if (this.allMediaFileGroups && this.allMediaFileGroups.length > 1) {
            this.groupText = ` +${this.allMediaFileGroups.length - 1} ${this.translateService.instant(OTHER_MEDIA_KEY)}`;
        }
    }

    goBack(): void {
        this.location.back();
    }

    generateName(name: string, type: MediaFileType): void {
        this.type = type;
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
        this.allMediaFileGroups!.forEach(group => {
            group.name = this.finalName!;
            if (this.season) {
                group.season = parseInt(this.season);
            }
        })

        this.mediaService.moveAllMedia(this.allMediaFileGroups!, this.type!).subscribe(errors => {
            if (isNotEmptyArray(errors)) {
                this.showPopup(this.translateService.instant(MOVE_FAILED_KEY));
            } else {
                this.showPopup(this.translateService.instant(MOVE_SUCCESS_KEY));
                this.goBack()
            }
        });
    }

    private showPopup(message: string) {
        const closeMsg = this.translateService.instant(CLOSE_KEY);
        this.snackBar.open(message, closeMsg, { duration: DURATION });
    }

    setSeason(season: string) {
        this.season = season;
    }
}
