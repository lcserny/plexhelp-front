import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

export const LANG_KEY = "vm-front-lang";
export const DEFAULT_LANG = "en";
export const DURATION = 3000;
export const CLOSE_KEY = "close";

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
