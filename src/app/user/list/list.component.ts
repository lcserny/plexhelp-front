import {Component} from '@angular/core';
import {UserService} from "../user.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserData} from "../../generated/auth/model/userData";
import {PageEvent} from "@angular/material/paginator";
import {SecurityService} from "../../security/security.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CLOSE_KEY, DURATION, NO_DATE_KEY} from "../../app.component";
import {FETCH_FAILED_KEY} from "../details/details.component";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {Pageable} from "../../base.service";

const USERS_PER_PAGE_KEY = "vm-front-users-perPage";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent {

    pageSizeOptions = environment.pageSizeOptions.usersList;
    defaultPageSize = Number(localStorage.getItem(USERS_PER_PAGE_KEY) || this.pageSizeOptions[1]);
    displayedColumns = ["edit", "id", "username", "firstName", "lastName", "status", "created"];
    dataSource = new MatTableDataSource<UserData>([]);
    totalItems = 0;

    searchForm: FormGroup;

    canUpdate = false;

    noDateText = this.translateService.instant(NO_DATE_KEY);

    constructor(private userService: UserService,
                private securityService: SecurityService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                private datePipe: DatePipe) {
        const userValue = this.securityService.userValue;
        if (userValue) {
            this.canUpdate = userValue.perms.includes("WRITE");
        }

        this.searchForm = new FormGroup({
            username: this.produceNumbersControl(),
            firstName: this.produceTextControl(),
            lastName: this.produceTextControl(),
        });

        this.reset();
    }

    produceNumbersControl(): FormControl {
        return new FormControl("", [Validators.pattern('[a-zA-Z0-9]+')]);
    }

    produceTextControl(): FormControl {
        return new FormControl("", [Validators.pattern('[a-zA-Z\-\']+')]);
    }

    reset() {
        this.searchForm.setControl("username", this.produceNumbersControl());
        this.searchForm.setControl("firstName", this.produceTextControl());
        this.searchForm.setControl("lastName", this.produceTextControl());
        this.loadData(0, this.defaultPageSize);
    }

    loadData(page: number, perPage: number) {
        let username;
        let firstName;
        let lastName;
        if (this.searchForm.valid) {
            username = this.searchForm.get("username")?.value;
            firstName = this.searchForm.get("firstName")?.value;
            lastName = this.searchForm.get("lastName")?.value;
        }

        const pageable = new Pageable(page, perPage);
        this.userService.getAllUsers(pageable, username, firstName, lastName).subscribe({
            next: paginatedUsers => {
                this.dataSource.data = paginatedUsers.data;
                this.totalItems = paginatedUsers.total;
            },
            error: _ => this.showError()
        });
    }

    onPageChange(event: PageEvent) {
        localStorage.setItem(USERS_PER_PAGE_KEY, String(event.pageSize));
        this.loadData(event.pageIndex, event.pageSize);
    }

    viewEdit(id: string) {
        this.router.navigate([`/user/details/${id}`]);
    }

    private showError() {
        this.snackBar.open(
            this.translateService.instant(FETCH_FAILED_KEY),
            this.translateService.instant(CLOSE_KEY),
            {duration: DURATION}
        );
    }

    search() {
        if (!this.searchForm.valid) {
            this.showError();
            return;
        }
        this.loadData(0, this.defaultPageSize);
    }

    formatDate(date?: string): string {
        return this.datePipe.transform(date) || this.noDateText;
    }
}
