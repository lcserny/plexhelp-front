import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MovedMediaService, MovedMediaView} from "../moved-media.service";

@Component({
  selector: 'movedMedia-tvshow-season',
  templateUrl: './tvshow-season.component.html',
  styleUrls: ['./tvshow-season.component.scss']
})
export class MovedMediaTVShowSeasonComponent implements OnInit {

    tvShowSeasonEpisodes: MovedMediaView[] = [];

    // TODO page for a season of a tvshows to present all episodes

    constructor(private route: ActivatedRoute, private movedMediaService: MovedMediaService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const mediaId = String(params["idx"]);
            const season = +params["nr"];
            const movedMedia = this.movedMediaService.getMovedMedia(mediaId);
            if (movedMedia) {
                this.tvShowSeasonEpisodes = this.movedMediaService.getAllTVShowEpisodes(movedMedia, season);
            }
        });
    }

    generateLink(media: MovedMediaView): string {
        return `/moved-media/detail/${media.id}`;
    }
}
