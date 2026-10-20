import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConfirmComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { questionKey: string }) {}
}
