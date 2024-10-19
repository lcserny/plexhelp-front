import {Component} from '@angular/core';
import {UserService} from "../user.service";
import {SecurityService} from "../../security/security.service";
import {UserResponse} from "../../generated/auth/model/userResponse";
import {UserData} from "../../generated/auth/model/userData";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {CLOSE_KEY, DURATION} from "../../app.component";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

export const FETCH_FAILED_KEY = "fetch user failed";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    providers: [DatePipe]
})
export class DetailsComponent {

    detailsForm?: FormGroup;

    userId: string;
    canUpdate = false;
    isAdmin = false;

    constructor(private userService: UserService,
                private securityService: SecurityService,
                public snackBar: MatSnackBar,
                private route: ActivatedRoute,
                private location: Location,
                private translateService: TranslateService,
                private datePipe: DatePipe,
                private formBuilder: FormBuilder,
                private router: Router) {
        this.userId = this.route.snapshot.paramMap.get("idx")!;
        this.initFormData();
    }

    private initFormData() {
        this.canUpdate = !!this.securityService.userValue?.perms.includes("WRITE");
        this.isAdmin = !!this.securityService.userValue?.roles.includes("ADMIN");

        this.userService.getUser(this.userId).subscribe(user => {
            if (!user || (user as UserResponse).error) {
                this.showError();
                return;
            }

            const userData = user as UserData;
            this.detailsForm = this.formBuilder.group({
                username: this.formBuilder.control({value: userData.username, disabled: true}, [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]),
                password: this.formBuilder.control({value: userData.password, disabled: !this.canUpdate}),
                firstName: this.formBuilder.control({value: userData.firstName, disabled: !this.canUpdate}, [Validators.required, Validators.pattern('[a-zA-Z\-\']+')]),
                lastName: this.formBuilder.control({value: userData.lastName, disabled: !this.canUpdate}, [Validators.required, Validators.pattern('[a-zA-Z\-\']+')]),
                roles: this.buildArray(userData.roles!),
                perms: this.buildArray(userData.perms!),
                status: this.formBuilder.control({value: userData.status, disabled: !this.canUpdate && !this.isAdmin}, Validators.required),
                created: this.formBuilder.control({value: this.datePipe.transform(userData.created, "yyyy-MM-ddThh:mm"), disabled: !this.canUpdate}, Validators.required),
            });
        });
    }

    private buildArray(list: string[]): FormArray {
        return this.formBuilder.array(list
            .map(value => this.formBuilder.control(
                {value, disabled: true},
                [Validators.required, Validators.pattern('[A-Z]+')]
            ))
        );
    }

    get roles(): FormArray {
        return this.detailsForm!.get("roles") as FormArray;
    }

    get perms(): FormArray {
        return this.detailsForm!.get("perms") as FormArray;
    }

    add(array: FormArray) {
        array.push(this.formBuilder.control({value: "", disabled: !this.canUpdate}, [Validators.required, Validators.pattern('[A-Z]+')]));
    }

    remove(array: FormArray, index: number) {
        array.removeAt(index);
    }

    private showError() {
        this.snackBar.open(
            this.translateService.instant(FETCH_FAILED_KEY),
            this.translateService.instant(CLOSE_KEY),
            {duration: DURATION}
        );
    }

    goBack(): void {
        this.location.back();
    }

    update() {
        if (!this.detailsForm?.valid) {
            this.showError();
            return;
        }

        const userData: UserData = {
            id: this.userId!,
            username: this.detailsForm.get("username")?.getRawValue(),
            password: this.detailsForm.get("password")?.getRawValue(),
            firstName: this.detailsForm.get("firstName")?.getRawValue(),
            lastName: this.detailsForm.get("lastName")?.getRawValue(),
            roles: this.detailsForm.get("roles")?.getRawValue(),
            perms: this.detailsForm.get("perms")?.getRawValue(),
            status: this.detailsForm.get("status")?.getRawValue(),
            created: this.detailsForm.get("created")?.getRawValue(),
        };

        this.userService.updateUser(this.userId, userData).subscribe(response => {
            if ((response as UserResponse).error) {
                this.showError();
                return;
            }

            this.router.navigate([`/user/details/${this.userId}`]);
        });
    }
}
