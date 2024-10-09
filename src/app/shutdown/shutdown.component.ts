import {Component} from '@angular/core';
import {ShutdownService} from '../shutdown.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from "@angular/forms";
import {CommandResponse} from "../generated/commander/model/commandResponse";
import {TranslateService} from "@ngx-translate/core";

export const DURATION = 3000;
export const CLOSE_KEY = "close";
export const SUCCESS_MSG = "{0} {1}";
export const SUCCESS_MSG_KEY = "performed successfully";
export const FAILED_MSG = "{0} {1}";
export const FAILED_MSG_KEY = "failed";
export const SHUTDOWN_KEY = "the shutdown_cmd";
export const RESTART_KEY = "the reboot_cmd";

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
        const action = this.translateService.instant(SHUTDOWN_KEY);
        this.shutdownService.shutdown(Number(minutes))
            .subscribe(cmdResp => this.showPopup(action, cmdResp));
    }

    reboot(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        const action = this.translateService.instant(RESTART_KEY);
        this.shutdownService.reboot(Number(minutes))
            .subscribe(cmdResp => this.showPopup(action, cmdResp));
    }

    private showPopup(action: string, cmdResp?: CommandResponse) {
        const msg = cmdResp?.status == "SUCCESS"
            ? SUCCESS_MSG.replace("{1}", this.translateService.instant(SUCCESS_MSG_KEY))
            : FAILED_MSG.replace("{1}", this.translateService.instant(FAILED_MSG_KEY));
        this.snackBar.open(msg.replace("{0}", action), this.translateService.instant(CLOSE_KEY), {duration: DURATION});
    }
}
