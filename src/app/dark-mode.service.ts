import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export const DARK_MODE_KEY = "vm-front-darkMode";

@Injectable({ providedIn: 'root' })
export class DarkModeService {

    public static darkModeClass = "darkMode";

    private darkModeSubject = new BehaviorSubject<boolean>(false);
    darkMode = this.darkModeSubject.asObservable();

    constructor() {
        const savedTheme = localStorage.getItem(DARK_MODE_KEY);
        if (savedTheme) {
            this.setDarkMode(savedTheme === 'true');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setDarkMode(prefersDark);
        }
    }

    setDarkMode(isDarkMode: boolean) {
        this.darkModeSubject.next(isDarkMode);
        localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());

        if (isDarkMode) {
            document.body.classList.add(DarkModeService.darkModeClass);
        } else {
            document.body.classList.remove(DarkModeService.darkModeClass);
        }
    }
}
