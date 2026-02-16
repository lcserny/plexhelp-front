import {Component, OnInit} from '@angular/core';
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'movedMedia-tvshow',
  templateUrl: './tvshow.component.html',
  styleUrls: ['./tvshow.component.scss']
})
export class MovedMediaTVShowComponent implements OnInit {

    tvShowSeasons: MovedMediaView[] = [];

    // TODO page for tvshows to present all seasons

    constructor(private route: ActivatedRoute, private movedMediaService: MovedMediaService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const mediaId = String(params["idx"]);
            const movedMedia = this.movedMediaService.getMovedMedia(mediaId);
            if (movedMedia) {
                this.tvShowSeasons = this.movedMediaService.getAllTVShowSeasons(movedMedia);
            }
        });
    }

    generateLink(media: MovedMediaView): string {
        return `/moved-media/tv-show/${media.id}/season/${media.season}`;
    }
}
