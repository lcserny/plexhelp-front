import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { ExtendedRenamedMediaOptions } from '../extended-data';
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

    // TODO: cleanup / refactor
    generateTVName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.TV)
            .subscribe(opts => {
                let extOpts: ExtendedRenamedMediaOptions = { renameOptions: opts, type: MediaFileType.TV };
                let cfg: MatBottomSheetConfig = { data: extOpts };
                // TODO
                let ref: MatBottomSheetRef<MediaDetailOptionsComponent, string> = 
                    this.bottomSheet.open(MediaDetailOptionsComponent, cfg);
                ref.afterDismissed().subscribe(data => {
                    if (data) {
                        console.log(data)
                    }
                });
            });
    }

    // TODO: cleanup / refactor
    generateMovieName(name: string): void {
        this.mediaService.generateNameOptions(name, MediaFileType.MOVIE)
            .subscribe(opts => {
                let extOpts: ExtendedRenamedMediaOptions = { renameOptions: opts, type: MediaFileType.MOVIE };
                let cfg: MatBottomSheetConfig = { data: extOpts };
                // TODO
                let ref: MatBottomSheetRef<MediaDetailOptionsComponent, string> = 
                    this.bottomSheet.open(MediaDetailOptionsComponent, cfg);
                ref.afterDismissed().subscribe(data => {
                    if (data) {
                        console.log(data)
                    }
                });
            });
    }
}
