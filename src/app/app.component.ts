import { Component, OnInit } from '@angular/core';
import { DarkModeService } from './dark-mode.service';
import {TranslateService} from "@ngx-translate/core";

export const LANG_KEY = "vm-front-lang";
export const DEFAULT_LANG = "en";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor (public darkModeService: DarkModeService, private translateService: TranslateService) {}

    ngOnInit(): void {
        this.darkModeService.toggleDarkMode();

        const lang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
        this.translateService.setDefaultLang(lang);
    }
}
