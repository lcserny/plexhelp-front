import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {formatNumber} from "../moved-media.module";

@Component({
  selector: 'movedMedia-tvshow-season',
  templateUrl: './tvshow-season.component.html',
  styleUrls: ['./tvshow-season.component.scss']
})
export class MovedMediaTVShowSeasonComponent implements OnInit {

    mediaShowId: string | undefined;
    mediaShowSeason: number | undefined;
    tvShowSeasonEpisodes: MovedMediaView[] = [];

    constructor(private route: ActivatedRoute,
                private movedMediaService: MovedMediaService,
                private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mediaShowId = String(params["idx"]);
            this.mediaShowSeason = +params["nr"];
            const movedMedia = this.movedMediaService.getMovedMedia(this.mediaShowId);
            if (movedMedia) {
                this.tvShowSeasonEpisodes = this.movedMediaService.getAllTVShowEpisodes(movedMedia, this.mediaShowSeason);
            }
        });
    }

    generateLink(media: MovedMediaView): string {
        return `/moved-media/detail/${media.id}`;
    }

    generateTitle(media: MovedMediaView): string {
        return this.movedMediaService.generateTitle(media);
    }

    formatEpisode(ep: number | undefined): string {
        return formatNumber(undefined, ep);
    }

    goBack(): void {
        this.router.navigate([`/moved-media/tv-show/${this.mediaShowId}`]);
    }

    async deleteSeason() {
        await this.movedMediaService.removeMovedMediaSeason(this.mediaShowId!);
        await this.router.navigate([`/moved-media/tv-show/${this.mediaShowId}`]);
    }
}
