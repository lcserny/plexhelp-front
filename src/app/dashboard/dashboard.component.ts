import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { SearchSnapshot } from '../search-snapshot';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    heroes: Hero[] = [];

    constructor(private heroService: HeroService, private searchSnapshot: SearchSnapshot) { }

    ngOnInit(): void {
        this.initHeroes();
    }

    initHeroes(): void {
        this.heroService.getHeroes()
            .subscribe(heroes => this.heroes = heroes.slice(1, 5));
        
        console.log(this.searchSnapshot.getNextSearch());
    }
}
