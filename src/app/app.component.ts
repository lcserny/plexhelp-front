import { Component, OnInit } from '@angular/core';
import { DarkModeService } from './dark-mode.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    
    constructor (public darkModeService: DarkModeService) {}
    
    ngOnInit(): void {
        this.darkModeService.toggleDarkMode();
    }
}
