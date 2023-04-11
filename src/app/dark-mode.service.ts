import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {

    public static darkModeClass = "darkMode";

    private darkModeStartHour = environment.darkModeStartHour;
    private darkModeEndHour = environment.darkModeEndHour;

    constructor(private overlay: OverlayContainer) { }

    public isDarkMode(): boolean {
        let currentHour = new Date().getHours();
        return currentHour >= this.darkModeStartHour || currentHour < this.darkModeEndHour;
    }

    toggleDarkMode(): void {
        if (this.isDarkMode()) {
            this.overlay.getContainerElement().classList.add(DarkModeService.darkModeClass);
        } else {
            this.overlay.getContainerElement().classList.remove(DarkModeService.darkModeClass);
        }
    }
}
