import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MovedMediaService, MovedMediaView} from "../moved-media.service";

@Component({
  selector: 'movedMedia-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class MovedMediaDetailComponent implements OnInit {

    movedMedia?: MovedMediaView;
    // TODO page for movie and episode details with buttons to delete and search subs

    constructor(private route: ActivatedRoute, private movedMediaService: MovedMediaService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const mediaId = String(params["idx"]);
            this.movedMedia = this.movedMediaService.getMovedMedia(mediaId);
        });
    }
}
