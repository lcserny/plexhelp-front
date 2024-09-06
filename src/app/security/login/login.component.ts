import {Component} from '@angular/core';
import {SecurityService} from "../../security.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

export const DURATION = 3000;
export const FAILED_MSG = "Login error, please try again or contact administrator.";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    loginForm: FormGroup;

    constructor(private securityService: SecurityService, private route: ActivatedRoute,
                private router: Router, public snackBar: MatSnackBar) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.snackBar.open(FAILED_MSG, "Close", {duration: DURATION});
            return;
        }

        const username = this.loginForm.get("username")?.value;
        const password = this.loginForm.get("password")?.value;

        this.securityService.login(username, password)
            .subscribe(user => {
                this.route.queryParamMap.subscribe(params => {
                    this.router.navigate([params.get("returnUrl") || "/"]);
                })
            });
    }
}
