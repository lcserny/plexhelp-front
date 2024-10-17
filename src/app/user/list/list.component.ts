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

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent {

    displayedColumns = ["id", "username", "firstName", "lastName", "status", "created", "edit"];
    dataSource = new MatTableDataSource<UserData>([]);
    totalItems = 0;

    canUpdate = false;

    constructor(private userService: UserService,
                private securityService: SecurityService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
        const userValue = this.securityService.userValue;
        if (userValue) {
            this.canUpdate = userValue.perms.includes("WRITE");
        }

        this.loadData(0, 10);
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
}
