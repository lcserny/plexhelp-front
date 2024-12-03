import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AbstractControl, ValidatorFn} from "@angular/forms";
import * as moment from "moment";

export const LANG_KEY = "vm-front-lang";
export const DEFAULT_LANG = "en";
export const DURATION = 3000;
export const CLOSE_KEY = "close";
export const NO_DATE_KEY = "no date available";
export const OPENAPI_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DD', // The format used when parsing input
    },
    display: {
        dateInput: 'YYYY-MM-DD', // The format used for displaying the date
        monthYearLabel: 'MMM YYYY', // The format for the month-year label on the calendar
        dateA11yLabel: 'LL', // Accessibility format
        monthYearA11yLabel: 'MMMM YYYY', // Accessibility month-year format
    }
};

export function momentDateValidator(format: string): ValidatorFn {
    return (control: AbstractControl) => {
        if (!control.value) {
            return null; // Don't validate if the value is empty
        }

        const isValid = moment(control.value, format, true).isValid();

        return isValid ? null : { invalidDate: { value: control.value } };
    };
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor (private translateService: TranslateService) {}

    ngOnInit(): void {
        const lang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
        this.translateService.setDefaultLang(lang);
    }
}
