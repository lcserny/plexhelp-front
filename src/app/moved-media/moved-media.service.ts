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

export interface MovedMediaDTO {
    // TODO used for nav, view needs to know where to route to, movie, tvShow seasons or tvShow episode
    id: string;
    type: MediaFileType;

    posterUrl: string;
    title: string;
    date: Date | null;
    description: string;
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

    getAllMovedMedia(mediaNamePart?: string): MovedMediaDTO[] {
        const foundMedia = mediaNamePart
            ? this.repository.findAllByMediaNameSubstr(mediaNamePart)
            : this.repository.findAll();
        return this.allToMovedMediaGroups(foundMedia);
    }

    private allToMovedMediaGroups(media: MovedMedia[]): MovedMediaDTO[] {
        if (!media) {
            return [];
        }

        let groupMap = new Map<string, MovedMedia>();
        media.forEach(m => groupMap.set(m.mediaName!, m));

        let results: MovedMediaDTO[] = [];
        groupMap.forEach((movedMedia, _) => results.push(this.toMovedMediaDTO(movedMedia)));
        return results;
    }

    private toMovedMediaDTO(media: MovedMedia): MovedMediaDTO {
        return {
            id: media.id,
            type: media.mediaType!,
            posterUrl: media.mediaDesc?.posterUrl ? media.mediaDesc.posterUrl : environment.fallbackPosterUrl,
            title: media.mediaName!,
            date: media.date,
            description: media.mediaDesc?.description ? media.mediaDesc.description : "No description available.",
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
