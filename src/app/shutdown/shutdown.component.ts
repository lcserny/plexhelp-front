import {Component} from '@angular/core';
import {ShutdownService} from '../shutdown.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from "@angular/forms";
import {CommandResponse} from "../generated/commander/model/commandResponse";

export const DURATION = 3000;
export const SUCCESS_MSG = "{0} performed successfully!";
export const FAILED_MSG = "{0} failed!";

@Component({
    selector: 'app-shutdown',
    templateUrl: './shutdown.component.html',
    styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent {

    shutdownForm: FormGroup;

    constructor(private shutdownService: ShutdownService, public snackBar: MatSnackBar) {
        this.shutdownForm = new FormGroup({
            minutes: new FormControl(''),
        });
    }

    shutdown(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.shutdown(Number(minutes))
            .subscribe(cmdResp => this.showPopup("Shutdown", cmdResp));
    }

    reboot(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.reboot(Number(minutes))
            .subscribe(cmdResp => this.showPopup("Restart", cmdResp));
    }

    private showPopup(action: string, cmdResp?: CommandResponse) {
        const msg = cmdResp?.status == "SUCCESS" ? SUCCESS_MSG : FAILED_MSG;
        this.snackBar.open(msg.replace("{0}", action), "Close", {duration: DURATION});
    }
}
