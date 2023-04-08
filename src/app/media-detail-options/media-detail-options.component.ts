import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';
import { MediaDescription, RenamedMediaOptions } from '../generated';

@Component({
    selector: 'app-media-detail-options',
    templateUrl: './media-detail-options.component.html',
    styleUrls: ['./media-detail-options.component.scss']
})
export class MediaDetailOptionsComponent {

    fallbackPosterUrl = environment.fallbackPosterUrl;

    constructor(
        private bottomSheetRef: MatBottomSheetRef<MediaDetailOptionsComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: RenamedMediaOptions,
    ) { }

    selectDescription(desc: MediaDescription): void {
        let mediaName = desc.title + (desc.date ? ` (${desc.date})` : "");
        this.bottomSheetRef.dismiss(mediaName);
    }
}
