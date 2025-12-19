import {Component} from '@angular/core';
import {ShutdownService} from '../shutdown.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {CLOSE_KEY, DEFAULT_LANG, DURATION, LANG_KEY} from "../app.component";

export const SHUTDOWN_SUCCESS_KEY = "shutdown successful";
export const SHUTDOWN_FAILED_KEY = "shutdown failed";
export const RESTART_SUCCESS_KEY = "restart successful";
export const RESTART_FAILED_KEY = "restart failed";
export const SLEEP_SUCCESS_KEY = "sleep successful";
export const SLEEP_FAILED_KEY = "sleep failed";
export const SERVICE_RESTART_SUCCESS_KEY = "service restart successful";
export const SERVICE_RESTART_FAILED_KEY = "service restart failed";
export const PROVIDE_SERVICE_NAME_KEY = "provide service name";

export const SERVICE_NAME_KEY = "vm-front-serviceName";

@Component({
    selector: 'app-shutdown',
    templateUrl: './shutdown.component.html',
    styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent {

    serviceName: string | null;
    shutdownForm: FormGroup;

    constructor(private shutdownService: ShutdownService,
                public snackBar: MatSnackBar,
                private translateService: TranslateService) {
        this.serviceName = localStorage.getItem(SERVICE_NAME_KEY);

        this.shutdownForm = new FormGroup({
            minutes: new FormControl(''),
            serviceName: new FormControl(this.serviceName, [Validators.required]),
        });
    }

    shutdown(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.shutdown(Number(minutes)).subscribe({
            next: _ => this.showPopup(this.translateService.instant(SHUTDOWN_SUCCESS_KEY)),
            error: _ => this.showPopup(this.translateService.instant(SHUTDOWN_FAILED_KEY))
        });
    }

    reboot(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.reboot(Number(minutes)).subscribe({
            next: _ => this.showPopup(this.translateService.instant(RESTART_SUCCESS_KEY)),
            error: _ => this.showPopup(this.translateService.instant(RESTART_FAILED_KEY))
        });
    }

    sleep(): void {
        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.sleep(Number(minutes)).subscribe({
            next: _ => this.showPopup(this.translateService.instant(SLEEP_SUCCESS_KEY)),
            error: _ => this.showPopup(this.translateService.instant(SLEEP_FAILED_KEY))
        });
    }

    restartService(): void {
        if (!this.shutdownForm.valid) {
            this.showPopup(this.translateService.instant(PROVIDE_SERVICE_NAME_KEY));
            return
        }

        const serviceName: string = this.shutdownForm.get("serviceName")?.value;
        localStorage.setItem(SERVICE_NAME_KEY, serviceName);

        const minutes = this.shutdownForm.get("minutes")?.value || 0;
        this.shutdownService.restartService(Number(minutes), serviceName).subscribe({
            next: _ => this.showPopup(this.translateService.instant(SERVICE_RESTART_SUCCESS_KEY)),
            error: _ => this.showPopup(this.translateService.instant(SERVICE_RESTART_FAILED_KEY))
        });
    }

    private showPopup(message: string) {
        this.snackBar.open(message, this.translateService.instant(CLOSE_KEY), {duration: DURATION});
    }
}
