import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRegistration} from "../../generated/auth/model/userRegistration";
import {UserService} from "../user.service";
import {CLOSE_KEY, DURATION} from "../../app.component";
import {TranslateService} from "@ngx-translate/core";

export const FAILED_MSG = "registration failed";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    registerForm: FormGroup;

    constructor(private userService: UserService, private route: ActivatedRoute,
                private router: Router, public snackBar: MatSnackBar, private translateService: TranslateService) {
        this.registerForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.pattern('[a-zA-Z]+')]),
            lastName: new FormControl('', [Validators.pattern('[a-zA-Z]+')]),
        });
    }

    register() {
        if (!this.registerForm.valid) {
            this.showError();
            return;
        }

        const userRegistration: UserRegistration = {
            username: this.registerForm.get("username")?.value,
            password: this.registerForm.get("password")?.value,
        };
        userRegistration.firstName = this.registerForm.get("firstName")?.value;
        userRegistration.lastName = this.registerForm.get("lastName")?.value;

        this.userService.register(userRegistration)
            .subscribe(response => {
                if (response.error) {
                    this.showError();
                    return;
                }

                this.router.navigate(["/security/login"]);
            });
    }

    private showError() {
        this.snackBar.open(
            this.translateService.instant(FAILED_MSG),
            this.translateService.instant(CLOSE_KEY),
            {duration: DURATION}
        );
    }
}
