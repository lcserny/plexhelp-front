import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ExtendedRenamedMediaOptions } from '../extended-data';

@Component({
    selector: 'app-media-detail-options',
    templateUrl: './media-detail-options.component.html',
    styleUrls: ['./media-detail-options.component.scss']
})
export class MediaDetailOptionsComponent implements OnInit {

    constructor(
        private bottomSheetRef: MatBottomSheetRef<MediaDetailOptionsComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: ExtendedRenamedMediaOptions,
    ) { }

    ngOnInit(): void {
        // TODO: use data to populate view
        console.log(this.data.type);
    }

    selectDescription(event: MouseEvent): void {
        // TODO: return MediaDescription selected
        this.bottomSheetRef.dismiss("Hello returned value!");
        // TODO: for buttons this is not needed
        event.preventDefault();
    }
}
