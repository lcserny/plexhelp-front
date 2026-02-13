import {Component, OnInit} from '@angular/core';
import {MovedMediaService} from "../moved-media.service";

@Component({
    selector: 'movedMedia-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class MovedMediaSearchComponent implements OnInit{

    constructor(private movedMediaService: MovedMediaService) {}

    async ngOnInit() {
        await this.movedMediaService.refreshMovedMedia();
        console.log(JSON.stringify(this.movedMediaService.getAllMovedMedia(), null, 2));
    }
}
