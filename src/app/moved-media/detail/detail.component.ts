import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {Location} from "@angular/common";
import {formatNumber} from "../moved-media.utils";

@Component({
  selector: 'movedMedia-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class MovedMediaDetailComponent implements OnInit {

    mediaId: string | undefined;
    movedMedia?: MovedMediaView;

    constructor(private route: ActivatedRoute,
                private movedMediaService: MovedMediaService,
                private location: Location,
                private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mediaId = String(params["idx"]);
            this.movedMedia = this.movedMediaService.getMovedMedia(this.mediaId);
        });
    }

    generateTitle(media: MovedMediaView): string {
        return this.movedMediaService.generateTitle(media);
    }

    generateSubtitle(media: MovedMediaView): string {
        switch (media.type) {
            case "MOVIE":
                return "MOVIE";
            case "TV":
                return `TV: ${formatNumber("S", media.season)}-${formatNumber("E", media.episode)}`;
        }
    }

    goBack(): void {
        this.location.back();
    }

    async deleteMedia(media: MovedMediaView) {
        await this.movedMediaService.removeMovedMedia(media);

        switch (media.type) {
            case "MOVIE":
                await this.router.navigate(['/moved-media/search'])
                break;
            case "TV":
                await this.router.navigate([`/moved-media/tv-show/${media.id}/season/${media.season}`]);
                break;
        }
    }

    // TODO
    findSubtitles(media: MovedMediaView): void {
        throw new Error("Method not implemented.");
    }
}
