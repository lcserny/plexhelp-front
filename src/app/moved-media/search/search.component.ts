import {Component, OnInit} from '@angular/core';
import {MovedMediaService} from "../moved-media.service";

@Component({
    selector: 'movedMedia-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class MovedMediaSearchComponent implements OnInit{

    // TODO main page, only this one has search field and order options

    // TODO on the view, the description if its undefined, use a default message translated

    constructor(private movedMediaService: MovedMediaService) {}

    async ngOnInit() {
        await this.movedMediaService.refreshMovedMedia();
        console.log(JSON.stringify(this.movedMediaService.getAllMovedMedia(), null, 2));
    }
}
