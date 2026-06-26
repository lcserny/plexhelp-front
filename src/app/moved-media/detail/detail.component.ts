import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MovedMediaService, MovedMediaView} from "../moved-media.service";
import {Location} from "@angular/common";

@Component({
  selector: 'movedMedia-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class MovedMediaDetailComponent implements OnInit {

    movedMedia?: MovedMediaView;

    constructor(private route: ActivatedRoute,
                private movedMediaService: MovedMediaService,
                private location: Location,
                private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const mediaId = String(params["idx"]);
            this.movedMedia = this.movedMediaService.getMovedMedia(mediaId);
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
                return `TV: S${media.season}E${media.episode}`;
        }
    }

    goBack(): void {
        this.location.back();
    }

    async deleteMedia(media: MovedMediaView) {
        await this.movedMediaService.removeMovedMedia(media);
        this.router.navigate(['/moved-media/search']);
    }

    findSubtitles(media: MovedMediaView): void {
        console.log("TODO delete");
    }
}
