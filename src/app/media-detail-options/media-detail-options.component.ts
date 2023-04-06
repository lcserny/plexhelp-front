import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-media-detail-options',
    templateUrl: './media-detail-options.component.html',
    styleUrls: ['./media-detail-options.component.scss']
})
export class MediaDetailOptionsComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<MediaDetailOptionsComponent>) { }

    // TODO: this needs to change the other component somehow?
    selectDescription(event: MouseEvent): void {
        // dismiss
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}
