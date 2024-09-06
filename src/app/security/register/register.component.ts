import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SecurityService} from "../../security.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRegistration} from "../models/users";

export const DURATION = 3000;
export const FAILED_MSG = "Registration error, please try again or contact administrator.";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    registerForm: FormGroup;

    constructor(private securityService: SecurityService, private route: ActivatedRoute,
                private router: Router, public snackBar: MatSnackBar) {
        this.registerForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.pattern('[a-zA-Z]+')]),
            lastName: new FormControl('', [Validators.pattern('[a-zA-Z]+')]),
        });
    }

    register() {
        if (!this.registerForm.valid) {
            this.snackBar.open(FAILED_MSG, "Close", {duration: DURATION});
            return;
        }

        const userRegistration = new UserRegistration(
            this.registerForm.get("username")?.value,
            this.registerForm.get("password")?.value
        );
        userRegistration.firstName = this.registerForm.get("firstName")?.value;
        userRegistration.lastName = this.registerForm.get("lastName")?.value;

        this.securityService.register(userRegistration)
            .subscribe(response => {
                if (response.error) {
                    this.snackBar.open(FAILED_MSG, "Close", {duration: DURATION});
                    return;
                }

                this.router.navigate(["/security/login"]);
            });
    }
}
