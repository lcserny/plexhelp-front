import {Component} from '@angular/core';
import {UserService} from "../user.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserData} from "../../generated/auth/model/userData";
import {UserResponse} from "../../generated/auth/model/userResponse";
import {PaginatedUsers} from "../../generated/auth/model/paginatedUsers";
import {PageEvent} from "@angular/material/paginator";
import {SecurityService} from "../../security/security.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CLOSE_KEY, DURATION} from "../../app.component";
import {FETCH_FAILED_KEY} from "../details/details.component";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";

const USERS_PER_PAGE_KEY = "vm-front-users-perPage";
const NO_DATE_KEY = "no date available";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent {

    pageSizeOptions = environment.usersListPageSizeOptions;
    defaultPageSize = Number(localStorage.getItem(USERS_PER_PAGE_KEY) || this.pageSizeOptions[1]);
    displayedColumns = ["edit", "id", "username", "firstName", "lastName", "status", "created"];
    dataSource = new MatTableDataSource<UserData>([]);
    totalItems = 0;

    searchForm: FormGroup;

    canUpdate = false;
    showPaginator = true;

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

        this.reset();

        this.searchForm = new FormGroup({
            username: new FormControl("", [Validators.pattern('[a-zA-Z0-9]+')]),
            firstName: new FormControl('', [Validators.pattern('[a-zA-Z\-\']+')]),
            lastName: new FormControl('', [Validators.pattern('[a-zA-Z\-\']+')]),
        });
    }

    reset() {
        this.showPaginator = true;
        this.loadData(0, this.defaultPageSize);
    }

    loadData(page: number, perPage: number) {
        this.userService.getAllUsers(page, perPage).subscribe(resp => {
            if ((resp as UserResponse).error) {
                this.showError();
                return;
            }

            const paginatedUsers = resp as PaginatedUsers;
            this.dataSource.data = paginatedUsers.data;
            this.totalItems = paginatedUsers.total;
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

        this.showPaginator = false;
        this.userService.search([
            { name: "username", value: this.searchForm.get("username")?.value },
            { name: "firstName", value: this.searchForm.get("firstName")?.value },
            { name: "lastName", value: this.searchForm.get("lastName")?.value },
        ]).subscribe(users => {
            this.dataSource.data = users;
            this.totalItems = users.length;
        });
    }

    formatDate(date?: string): string {
        return this.datePipe.transform(date, "yyyy-MM-dd") || this.noDateText;
    }
}
