import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {MatPaginatorIntl} from "@angular/material/paginator";

export const ITEMS_PER_PAGE_KEY = "items per page";
export const NEXT_PAGE_KEY = "next page";
export const PREV_PAGE_KEY = "prev page";
export const FIRST_PAGE_KEY = "first page";
export const LAST_PAGE_KEY = "last page";
export const PAGE_ONE_ONE_KEY = "page one of one";
export const PAGE_KEY = "page";
export const OF_KEY = "of";

@Injectable()
export class TranslatedPaginator extends MatPaginatorIntl {

    constructor(private translateService: TranslateService) {
        super();

        super.itemsPerPageLabel = this.translateService.instant(ITEMS_PER_PAGE_KEY);
        super.nextPageLabel = this.translateService.instant(NEXT_PAGE_KEY);
        super.previousPageLabel = this.translateService.instant(PREV_PAGE_KEY);
        super.firstPageLabel = this.translateService.instant(FIRST_PAGE_KEY);
        super.lastPageLabel = this.translateService.instant(LAST_PAGE_KEY);
    }

    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0) {
            return this.translateService.instant(PAGE_ONE_ONE_KEY);
        }
        const amountPages = Math.ceil(length / pageSize);
        return `${this.translateService.instant(PAGE_KEY)} ${page + 1} ${this.translateService.instant(OF_KEY)} ${amountPages}`;
    };
}
