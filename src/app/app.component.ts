import {Component, Injectable, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NativeDateAdapter} from "@angular/material/core";
import {environment} from "../environments/environment";
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const LANG_KEY = "vm-front-lang";
export const DEFAULT_LANG = "en";
export const DURATION = 3000;
export const CLOSE_KEY = "close";
export const NO_DATE_KEY = "no date available";

export function booleanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return typeof control.value === 'boolean' ? null : { notBoolean: true };
    };
}

@Injectable({providedIn: 'root'})
export class CustomDateAdapter extends NativeDateAdapter {
    override getFirstDayOfWeek(): number {
        return environment.region.firstDayWeek;
    }
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
