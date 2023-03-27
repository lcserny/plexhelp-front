import { Component, OnInit } from '@angular/core';
import { SearchSnapshot } from './search-snapshot';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'Tour of Heroes';

    constructor(private searchSnapshot: SearchSnapshot) {}

    ngOnInit(): void {
        this.searchSnapshot.initSearches();
    }
}
