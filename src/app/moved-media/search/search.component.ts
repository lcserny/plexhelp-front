import {Component, OnInit} from '@angular/core';
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {Router} from "@angular/router";
import {routes} from "../../routing/routing.module";

@Component({
    selector: 'movedMedia-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class MovedMediaSearchComponent implements OnInit{

    movedMediaList: MovedMediaView[] = [];

    // TODO main page, only this one has search field and order options

    constructor(private movedMediaService: MovedMediaService, private router: Router) {}

    async ngOnInit() {
        await this.movedMediaService.refreshMovedMedia();
        this.movedMediaList = this.movedMediaService.getAllMovedMedia();
        console.log(JSON.stringify(this.movedMediaList, null, 2));
    }

    generateLink(media: MovedMediaView): string {
        switch (media.type) {
            case "MOVIE":
                return `/moved-media/detail/${media.id}`;
            case "TV":
                return `/moved-media/tv-show/${media.id}`;
        }
    }
}
