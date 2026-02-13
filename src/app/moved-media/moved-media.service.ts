import {Injectable} from '@angular/core';
import {MovedMedia, MovedMediaRepository} from "./moved-media.repository";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BaseService} from "../base.service";
import {MessageService} from "../message.service";
import {environment} from "../../environments/environment";
import {catchError, firstValueFrom, Observable, tap} from "rxjs";
import {MovedMediaData} from "../generated/commander/model/movedMediaData";
import {MediaFileType} from "../generated/commander/model/mediaFileType";
import {MediaDescriptionData} from "../generated/commander/model/mediaDescriptionData";

const noId = "<noId>";

// TODO define better hierarchy: groupItem > seasonItem (optional) > mediaItem (episode or movie)
export interface MovedMediaGroup {
    posterUrl: string; // fallback to default if empty
    fullTitle: string; // including date if any
    season?: number;
    description: string; // fallback to "No description available"
    cast: string[];
    mediaList: MovedMedia[];
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

    getAllMovedMedia(mediaNamePart?: string): MovedMediaGroup[] {
        const foundMedia = mediaNamePart
            ? this.repository.findAllByMediaNameSubstr(mediaNamePart)
            : this.repository.findAll();
        return this.allToMovedMediaGroups(foundMedia);
    }

    private allToMovedMediaGroups(media: MovedMedia[]): MovedMediaGroup[] {
        if (!media) {
            return [];
        }

        let groupMap = new Map<string, MovedMedia[]>();
        media.forEach(m => {
            const key = m.mediaName! + m.season;
            if (!groupMap.has(key)) {
                groupMap.set(key, []);
            }
            groupMap.get(key)!.push(m);
        });

        let results: MovedMediaGroup[] = [];
        groupMap.forEach((movedMediaList, _) => {
            const first = movedMediaList[0];
            // FIXME
            results.push({
                description: first.mediaDesc!,
                mediaList: movedMediaList
            });
        });

        return results;
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
