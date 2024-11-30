import {Component} from '@angular/core';
import {SecurityService} from "../security.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CLOSE_KEY, DURATION} from "../../app.component";
import {TranslateService} from "@ngx-translate/core";

export const FAILED_KEY = "login error";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    loginForm: FormGroup;

    constructor(private securityService: SecurityService, private route: ActivatedRoute,
                private router: Router, public snackBar: MatSnackBar, private translateService: TranslateService,) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.showError();
            return;
        }

        const username = this.loginForm.get("username")?.value;
        const password = this.loginForm.get("password")?.value;

        this.securityService.login(username, password)
            .subscribe(user => {
                if (!user) {
                    this.showError();
                    return;
                }

                this.route.queryParamMap.subscribe(params => {
                    this.router.navigate([params.get("returnUrl") || "/"]);
                })
            });
    }

    private showError() {
        this.snackBar.open(
            this.translateService.instant(FAILED_KEY),
            this.translateService.instant(CLOSE_KEY),
            {duration: DURATION}
        );
    }
}
