import {Component, inject} from '@angular/core';
import {MagnetService} from "../magnet.service";
import {MagnetData} from "../../generated/commander/model/magnetData";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {AddDialogComponent} from "../add-dialog/add-dialog.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CLOSE_KEY, DURATION} from "../../app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Pageable} from "../../base.service";

const MAGNETS_PER_PAGE_KEY = "vm-front-magnets-perPage";
const NO_DATE_KEY = "no date available";
const FETCH_FAILED_KEY = "fetch magnets failed";

@Component({
    selector: 'app-magnets-list',
    templateUrl: './magnets-list.component.html',
    styleUrls: ['./magnets-list.component.scss']
})
export class MagnetsListComponent {

    noDateText = this.translateService.instant(NO_DATE_KEY);

    defaultSort = ["downloaded,ASC", "dateAdded,ASC"];
    pageSizeOptions = environment.pageSizeOptions.magnets;
    defaultPageSize = Number(localStorage.getItem(MAGNETS_PER_PAGE_KEY) || this.pageSizeOptions[0]);
    displayedColumns = ["downloaded", "name", "hash", "dateAdded", "dateDownloaded"];
    dataSource = new MatTableDataSource<MagnetData>([]);
    totalItems = 0;

    searchForm: FormGroup;

    readonly dialog = inject(MatDialog);

    constructor(private magnetService: MagnetService,
                private datePipe: DatePipe,
                private translateService: TranslateService,
                private snackBar: MatSnackBar) {
        this.searchForm = new FormGroup({name: this.produceDefaultNameControl()});
        this.reset();
    }

    private produceDefaultNameControl(): FormControl {
        return new FormControl("", [Validators.pattern(/[a-zA-Z0-9]+/)]);
    }

    reset() {
        this.searchForm.setControl("name", this.produceDefaultNameControl());
        this.loadMagnets(0, this.defaultPageSize, this.defaultSort);
    }

    loadMagnets(page: number, size: number, sort: string[]) {
        let name;
        if (this.searchForm.valid) {
            name = this.searchForm.get("name")?.value;
        }

        const pageable = new Pageable(page, size, sort);
        this.magnetService.getAllMagnets(pageable, name).subscribe({
            next: paginatedMagnets => {
                this.dataSource.data = paginatedMagnets.content;
                this.totalItems = paginatedMagnets.page.totalElements;
            },
            error: _ => this.showError()
        });
    }

    onPageChange(event: PageEvent) {
        localStorage.setItem(MAGNETS_PER_PAGE_KEY, String(event.pageSize));
        this.loadMagnets(event.pageIndex, event.pageSize, this.defaultSort);
    }

    formatDate(date?: string): string {
        if (!date) {
            return this.noDateText;
        }
        const converted = new Date(parseFloat(date) * 1000);
        const format = environment.region.dateFormat + " " + environment.region.timeFormat;
        return this.datePipe.transform(converted, format)!;
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddDialogComponent);
        dialogRef.afterClosed().subscribe(magnetLink => {
            if (magnetLink !== undefined) {
                this.magnetService.addMagnet(magnetLink).subscribe({
                    next: _ => this.loadMagnets(0, this.defaultPageSize, this.defaultSort),
                    error: _ => this.showError()
                });
            }
        });
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
        this.loadMagnets(0, this.defaultPageSize, this.defaultSort);
    }
}
