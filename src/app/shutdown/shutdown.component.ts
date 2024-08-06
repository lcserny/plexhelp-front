import {Component} from '@angular/core';
import {ShutdownService} from '../shutdown.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommandResponse, Status} from "../generated";

export const DURATION = 3000;
export const SUCCESS_MSG = "{0} performed successfully!";
export const FAILED_MSG = "{0} failed!";

@Component({
    selector: 'app-shutdown',
    templateUrl: './shutdown.component.html',
    styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent {

    minutes?: number;

    constructor(private shutdownService: ShutdownService, public snackBar: MatSnackBar) {
    }

    shutdown(): void {
        this.shutdownService.shutdown(this.minutes || 0)
            .subscribe(cmdResp => this.showPopup("Shutdown", cmdResp));
    }

    reboot(): void {
        this.shutdownService.reboot(this.minutes || 0)
            .subscribe(cmdResp => this.showPopup("Restart", cmdResp));
    }

    private showPopup(action: string, cmdResp?: CommandResponse) {
        if (cmdResp?.status == Status.SUCCESS) {
            this.snackBar.open(SUCCESS_MSG.replace("{0}", action), "Close", {duration: DURATION});
        } else {
            this.snackBar.open(FAILED_MSG.replace("{0}", action), "Close", {duration: DURATION});
        }
    }
}
