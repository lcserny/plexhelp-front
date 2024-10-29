import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent {

    magnetLink?: string;

    constructor(@Inject(MatDialogRef<AddDialogComponent>) public dialogRef: MatDialogRef<AddDialogComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClose(): string | undefined {
        return this.magnetLink;
    }
}
