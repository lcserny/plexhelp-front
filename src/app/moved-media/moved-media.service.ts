import {Injectable} from '@angular/core';
import {MovedMedia, MovedMediaRepository} from "./moved-media.repository";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BaseService} from "../base.service";
import {MessageService} from "../message.service";
import {environment} from "../../environments/environment";
import {catchError, firstValueFrom, Observable, tap} from "rxjs";
import {MovedMediaData} from "../generated/commander/model/movedMediaData";
import {MediaFileType} from "../generated/commander/model/mediaFileType";
import {DatePipe} from "@angular/common";

const noId = "<noId>";

export const sortOptions: SortData[] = [
    { field: "title", direction: "asc", label: "sort-name-asc" },
    { field: "title", direction: "desc", label: "sort-name-desc" },
    { field: "date", direction: "asc", label: "sort-date-asc" },
    { field: "date", direction: "desc", label: "sort-date-desc" }
];

export interface SortData {
    field: string;
    direction: "asc" | "desc";
    label: string;
}

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
                private datePipe: DatePipe,
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

    getAllMovedMedia(selectedSort: SortData, mediaNamePart?: string): MovedMediaView[] {
        const foundMedia = mediaNamePart
            ? this.repository.findAllByMediaNameSubstr(mediaNamePart)
            : this.repository.findAll();
        let converted = this.convertGroupedByMediaName(foundMedia);
        return this.sortByField(converted, selectedSort.field as keyof MovedMediaView, selectedSort.direction);
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
            cast: media.mediaDesc?.cast || []
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

    generateTitle(media: MovedMediaView): string {
        return media.title + (media.date ? ` (${this.formatDate(media.date)})` : "");
    }

    formatDate(date: Date): string {
        return this.datePipe.transform(date, environment.region.dateFormat)!;
    }

    private sortByField<T>(
        items: T[],
        field: keyof T,
        direction: 'asc' | 'desc'
    ): T[] {
        return [...items].sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];

            if (valueA === undefined || valueA === null) return 1;
            if (valueB === undefined || valueB === null) return -1;

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }

            if (valueA instanceof Date && valueB instanceof Date) {
                return direction === 'asc'
                    ? valueA.getTime() - valueB.getTime()
                    : valueB.getTime() - valueA.getTime();
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            return direction === 'asc'
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
    }
}
