import {Component} from '@angular/core';
import {ShutdownService} from '../shutdown.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {CLOSE_KEY, DURATION} from "../app.component";

export const SHUTDOWN_SUCCESS_KEY = "shutdown successful";
export const SHUTDOWN_FAILED_KEY = "shutdown failed";
export const RESTART_SUCCESS_KEY = "restart successful";
export const RESTART_FAILED_KEY = "restart failed";

@Component({
    selector: 'app-shutdown',
    templateUrl: './shutdown.component.html',
    styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent {

    shutdownForm: FormGroup;

    constructor(private shutdownService: ShutdownService,
                public snackBar: MatSnackBar,
                private translateService: TranslateService
    ) {
        this.shutdownForm = new FormGroup({
            minutes: new FormControl(''),
        });
    }

    shutdown(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.shutdown(Number(minutes))
            .subscribe(cmdResp => this.showPopup(cmdResp?.status === "SUCCESS"
                ? this.translateService.instant(SHUTDOWN_SUCCESS_KEY)
                : this.translateService.instant(SHUTDOWN_FAILED_KEY)
            ));
    }

    reboot(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.reboot(Number(minutes))
            .subscribe(cmdResp => this.showPopup(cmdResp?.status === "SUCCESS"
                ? this.translateService.instant(RESTART_SUCCESS_KEY)
                : this.translateService.instant(RESTART_FAILED_KEY)
            ));
    }

    private showPopup(message: string) {
        this.snackBar.open(message, this.translateService.instant(CLOSE_KEY), {duration: DURATION});
    }
}
