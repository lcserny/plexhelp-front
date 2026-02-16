import {Injectable} from '@angular/core';
import {MovedMedia, MovedMediaRepository} from "./moved-media.repository";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BaseService} from "../base.service";
import {MessageService} from "../message.service";
import {environment} from "../../environments/environment";
import {catchError, firstValueFrom, Observable, tap} from "rxjs";
import {MovedMediaData} from "../generated/commander/model/movedMediaData";
import {MediaFileType} from "../generated/commander/model/mediaFileType";

const noId = "<noId>";

export interface MovedMediaView {
    id: string;
    type: MediaFileType;
    season: number | undefined;
    episode: number | undefined;

    posterUrl: string;
    title: string;
    date: Date | null;
    description: string | undefined;
    cast: string[];
}

@Injectable({providedIn: 'root'})
export class MovedMediaService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'plain/text'}),
        withCredentials: true
    };

    constructor(private httpClient: HttpClient,
                private repository: MovedMediaRepository,
                protected override messageService: MessageService) {
        super(messageService);
    }

    async refreshMovedMedia() {
        const resp: Observable<MovedMediaData[]> = this.httpClient.get<MovedMediaData[]>(`${environment.commanderApiUrl}/media-moves`, this.httpOptions).pipe(
            tap(media => this.info(`${media.length} movedMedia(s) retrieved`)),
            catchError(err => this.error(err))
        );
        const movedMedia = await firstValueFrom(resp);
        this.repository.saveAll(this.allToMovedMedia(movedMedia));
    }

    getAllMovedMedia(mediaNamePart?: string): MovedMediaView[] {
        const foundMedia = mediaNamePart
            ? this.repository.findAllByMediaNameSubstr(mediaNamePart)
            : this.repository.findAll();
        return this.convertGroupedByMediaName(foundMedia);
    }

    getMovedMedia(mediaId: string): MovedMediaView | undefined {
        const media = this.repository.findById(mediaId);
        if (media) {
            return this.toMovedMediaView(media);
        }
        return undefined;
    }

    getAllTVShowSeasons(movedMedia: MovedMediaView): MovedMediaView[] {
        const media = this.repository.findAllByMediaTypeAndDateAndMediaName("TV", movedMedia.date, movedMedia.title);
        if (!media) {
            return [];
        }
        const groupMap = new Map<number, MovedMedia>(media.map(m => [m.season!, m]));
        return Array.from(groupMap.values()).map(movedMedia => this.toMovedMediaView(movedMedia));
    }

    getAllTVShowEpisodes(movedMedia: MovedMediaView, season: number): MovedMediaView[] {
        const media = this.repository.findAllByMediaTypeAndDateAndMediaNameAndSeason("TV", movedMedia.date, movedMedia.title, season);
        if (!media) {
            return [];
        }
        return media.map(movedMedia => this.toMovedMediaView(movedMedia));
    }

    private convertGroupedByMediaName(media: MovedMedia[]): MovedMediaView[] {
        if (!media) {
            return [];
        }
        const groupMap = new Map<string, MovedMedia>(media.map(m => [m.mediaName!, m]));
        return Array.from(groupMap.values()).map(movedMedia => this.toMovedMediaView(movedMedia));
    }

    private toMovedMediaView(media: MovedMedia): MovedMediaView {
        return {
            id: media.id,
            type: media.mediaType!,
            season: media.season,
            episode: media.episode,
            posterUrl: media.mediaDesc?.posterUrl ? media.mediaDesc.posterUrl : environment.fallbackPosterUrl,
            title: media.mediaName!,
            date: media.date,
            description: media.mediaDesc?.description,
            cast: media.mediaDesc!.cast!
        };
    }

    private allToMovedMedia(media: MovedMediaData[]): MovedMedia[] {
        return media.map(m => this.toMovedMedia(m));
    }

    private toMovedMedia(media: MovedMediaData): MovedMedia {
        return { ...media,
            id: media.id || noId,
            date: media.date ? new Date(parseFloat(media.date) * 1000) : null,
        }
    }
}
