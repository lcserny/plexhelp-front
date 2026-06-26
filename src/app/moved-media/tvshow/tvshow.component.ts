import {Component, OnInit} from '@angular/core';
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatNumber} from "../moved-media.utils";

@Component({
  selector: 'movedMedia-tvshow',
  templateUrl: './tvshow.component.html',
  styleUrls: ['./tvshow.component.scss']
})
export class MovedMediaTVShowComponent implements OnInit {

    mediaShowId: string | undefined;
    tvShowSeasons: MovedMediaView[] = [];

    constructor(private route: ActivatedRoute,
                private movedMediaService: MovedMediaService,
                private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mediaShowId = String(params["idx"]);
            const movedMedia = this.movedMediaService.getMovedMedia(this.mediaShowId);
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
        this.router.navigate(['/moved-media/search']);
    }

    formatSeason(s: number | undefined): string {
        return formatNumber(undefined, s);
    }

    async deleteShow() {
        await this.movedMediaService.removeMovedMediaShow(this.mediaShowId!);
        await this.router.navigate(['/moved-media/search']);
    }
}
