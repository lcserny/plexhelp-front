import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import {BaseService, Pageable} from './base.service';
import {environment} from "../environments/environment";
import {MediaFileGroup} from "./generated/commander/model/mediaFileGroup";
import {MediaFileType} from "./generated/commander/model/mediaFileType";
import {RenamedMediaOptions} from "./generated/commander/model/renamedMediaOptions";
import {MediaRenameRequest} from "./generated/commander/model/mediaRenameRequest";
import {MediaMoveError} from "./generated/commander/model/mediaMoveError";
import {MediaMoveRequest} from "./generated/commander/model/mediaMoveRequest";
import {DownloadedMediaData} from "./generated/commander/model/downloadedMediaData";
import {SearchDownloadedMedia} from "./generated/commander/model/searchDownloadedMedia";
import {PaginatedDownloads} from "./generated/commander/model/paginatedDownloads";
import {MediaDescriptionData} from "./generated/commander/model/mediaDescriptionData";

@Injectable({ providedIn: 'root' })
export class MediaService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    searchMedia(): Observable<MediaFileGroup[]> {
        const url = `${environment.commanderApiUrl}/media-searches`;
        return this.http.get<MediaFileGroup[]>(url, this.httpOptions).pipe(
            tap(groups => this.info(`search for media files returned ${groups.length} files`)),
            catchError(err => this.error(err))
        );
    }

    searchDownloadedMedia(date?: Date, downloaded?: boolean, names?: string[]): Observable<DownloadedMediaData[]> {
        const url = `${environment.commanderApiUrl}/media-downloads`;

        let req: SearchDownloadedMedia = { downloaded, names};
        if (date) {
            req.date = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        }

        return this.http.post<DownloadedMediaData[]>(url, req, this.httpOptions).pipe(
            tap(medias => this.info(`retrieved ${medias.length} downloaded media for: ${date?.toISOString()}, ${downloaded}, ${names?.join(', ')}`)),
            catchError(err => this.error(err))
        );
    }

    searchPaginatedDownloadedMedia(pageable: Pageable, date?: Date, downloaded?: boolean, name?: string): Observable<PaginatedDownloads> {
        const sortJoined = pageable.sortJoined();
        const url = `${environment.commanderApiUrl}/media-downloads/paginated?page=${pageable.page}&size=${pageable.perPage}${sortJoined}`;

        let names: string[] = [];
        if (name) {
            names.push(name);
        }

        let req: SearchDownloadedMedia = { downloaded, names };
        if (date) {
            req.date = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        }

        return this.http.post<PaginatedDownloads>(url, req, this.httpOptions).pipe(
            tap(page => this.info(`retrieved ${page.content.length} downloaded media for: ${date}, ${downloaded}, ${name}`)),
            catchError(err => this.error(err))
        );
    }

    generateNameOptions(name: string, type: MediaFileType): Observable<RenamedMediaOptions> {
        const url = `${environment.commanderApiUrl}/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions).pipe(
            tap(opts => this.info(`generated media options for ${name} with type ${type} and origin ${opts.origin}`)),
            catchError(err => this.error(err))
        );
    }

    moveAllMedia(fileGroups: MediaFileGroup[], type: MediaFileType, mediaDesc: MediaDescriptionData): Observable<MediaMoveError[]> {
        const url = `${environment.commanderApiUrl}/media-moves/all`;
        const req: MediaMoveRequest[] = fileGroups.map(fileGroup => { return { fileGroup, type, mediaDesc } });
        return this.http.post<MediaMoveError[]>(url, req, this.httpOptions).pipe(
            tap(errors => {
                for (let e of errors) {
                    this.log(`moved media failed: ${e.error} for ${e.mediaPath}`, "ERROR");
                }
                this.info(`moved all media with type ${type}`);
            }),
            catchError(err => this.error(err))
        );
    }
}
