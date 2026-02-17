import {Component, OnInit} from '@angular/core';
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../environments/environment";
import {DatePipe, Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'movedMedia-tvshow',
  templateUrl: './tvshow.component.html',
  styleUrls: ['./tvshow.component.scss']
})
export class MovedMediaTVShowComponent implements OnInit {

    tvShowSeasons: MovedMediaView[] = [];

    constructor(private route: ActivatedRoute,
                private movedMediaService: MovedMediaService,
                private location: Location) {}

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

    generateTitle(media: MovedMediaView): string {
        return this.movedMediaService.generateTitle(media);
    }

    goBack(): void {
        this.location.back();
    }
}
