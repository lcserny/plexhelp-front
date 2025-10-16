import {Component} from '@angular/core';
import {environment} from "../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DownloadedMediaData} from "../../generated/commander/model/downloadedMediaData";
import {MediaService} from "../../media.service";
import {Pageable} from "../../base.service";
import {CLOSE_KEY, DURATION, momentDateValidator, MY_DATE_FORMATS, NO_DATE_KEY} from "../../app.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';
import {DatePipe} from "@angular/common";
import {PageEvent} from "@angular/material/paginator";

const DOWNLOADS_PER_PAGE_KEY = "vm-front-downloads-perPage";
const FETCH_FAILED_KEY = "fetch downloads failed";

@Component({
  selector: 'app-downloads-list',
  templateUrl: './downloads-list.component.html',
  styleUrls: ['./downloads-list.component.scss']
})
export class DownloadsListComponent {

    defaultSort = ["dateDownloaded,DESC"];
    pageSizeOptions = environment.pageSizeOptions.downloads;
    defaultPageSize = Number(localStorage.getItem(DOWNLOADS_PER_PAGE_KEY) || this.pageSizeOptions[1]);
    displayedColumns = ["id", "fileName", "fileSize", "dateDownloaded", "downloadComplete"];
    dataSource = new MatTableDataSource<DownloadedMediaData>([]);
    totalItems = 0;

    downloadsForm: FormGroup;
    noDateText: string;

    constructor(private mediaService: MediaService,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                private datePipe: DatePipe) {
        this.noDateText = this.translateService.instant(NO_DATE_KEY);

        this.downloadsForm = new FormGroup({
            date: this.produceDateControl(),
            fileName: this.produceTextControl(),
            downloaded: this.produceCheckmarkControl(),
        });

        this.reset();
    }

    reset() {
        this.downloadsForm.setControl("date", this.produceDateControl());
        this.downloadsForm.setControl("fileName", this.produceTextControl());
        this.downloadsForm.setControl("downloaded", this.produceCheckmarkControl());
        this.loadData(0, this.defaultPageSize, this.defaultSort);
    }

    loadData(page: number, perPage: number, sort: string[]) {
        let date: Date = new Date();
        let fileName: string = "";
        let downloaded: boolean = false;
        if (this.downloadsForm.valid) {
            date = this.downloadsForm.get("date")?.value;
            if (moment.isMoment(date)) {
                date = date.toDate();
            }

            fileName = this.downloadsForm.get("fileName")?.value;
            downloaded = (this.downloadsForm.get("downloaded")?.value === true);
        }

        this.mediaService.searchPaginatedDownloadedMedia(new Pageable(page, perPage, sort), date, downloaded, fileName).subscribe({
            next: paginatedResults => {
                this.dataSource.data = paginatedResults.content;
                this.totalItems = paginatedResults.page.totalElements;
            },
            error: _ => this.showError()
        });
    }

    produceTextControl(): FormControl {
        return new FormControl("", [Validators.pattern('[a-zA-Z0-9\-\'\./\s]+')]);
    }

    produceDateControl(): FormControl {
        return new FormControl("", [momentDateValidator(MY_DATE_FORMATS.parse.dateInput)]);
    }

    produceCheckmarkControl(): FormControl {
        return new FormControl("", [Validators.pattern('true|false')]);
    }

    search() {
        if (!this.downloadsForm.valid) {
            this.showError();
            return;
        }
        this.loadData(0, this.defaultPageSize, this.defaultSort);
    }

    onPageChange(event: PageEvent) {
        localStorage.setItem(DOWNLOADS_PER_PAGE_KEY, String(event.pageSize));
        this.loadData(event.pageIndex, event.pageSize, this.defaultSort);
    }

    private showError() {
        this.snackBar.open(
            this.translateService.instant(FETCH_FAILED_KEY),
            this.translateService.instant(CLOSE_KEY),
            {duration: DURATION}
        );
    }

    formatDate(date?: number): string {
        return this.datePipe.transform(date ? date * 1000 : date, "yyyy-MM-dd") || this.noDateText;
    }

    formatSize(size?: number): string {
        return size ? (size / 1024 / 1024).toFixed(2) + " MB" : "";
    }
}
