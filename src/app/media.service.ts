import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { BaseService } from './base.service';
import {environment} from "../environments/environment";
import {MediaFileGroup} from "./generated/commander/model/mediaFileGroup";
import {MediaFileType} from "./generated/commander/model/mediaFileType";
import {RenamedMediaOptions} from "./generated/commander/model/renamedMediaOptions";
import {MediaRenameRequest} from "./generated/commander/model/mediaRenameRequest";
import {MediaMoveError} from "./generated/commander/model/mediaMoveError";
import {MediaMoveRequest} from "./generated/commander/model/mediaMoveRequest";
import {map} from "rxjs/operators";
import {DownloadedMediaData} from "./generated/commander/model/downloadedMediaData";
import {SearchDownloadedMedia} from "./generated/commander/model/searchDownloadedMedia";

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
            map(groups => {
                this.log(`search for media files returned ${groups.length} files`);
                return groups;
            }),
            catchError(this.handleError<MediaFileGroup[]>("searchMedia", []))
        );
    }

    searchDownloadedMedia(date?: Date, downloaded?: boolean, names?: string[]): Observable<DownloadedMediaData[]> {
        const url = `${environment.commanderApiUrl}/media-downloads`;

        let req: SearchDownloadedMedia = { downloaded, names};
        if (date) {
            req.date = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        }

        return this.http.post<DownloadedMediaData[]>(url, req, this.httpOptions).pipe(
            tap(medias => this.log(`retrieved ${medias.length} downloaded media for: ${date?.toISOString()}, ${downloaded}, ${names?.join(', ')}`)),
            catchError(this.handleError<DownloadedMediaData[]>("searchDownloadedMedia"))
        );
    }

    generateNameOptions(name: string, type: MediaFileType): Observable<RenamedMediaOptions> {
        const url = `${environment.commanderApiUrl}/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions).pipe(
            tap(opts => this.log(`generated media options for ${name} with type ${type} and origin ${opts.origin}`)),
            catchError(this.handleError<RenamedMediaOptions>("generateNameOptions"))
        );
    }

    moveMedia(fileGroup: MediaFileGroup, type: MediaFileType): Observable<MediaMoveError[]> {
        const url = `${environment.commanderApiUrl}/media-moves`;
        const req: MediaMoveRequest = { fileGroup, type };
        return this.http.post<MediaMoveError[]>(url, req, this.httpOptions).pipe(
            tap(errors => {
                if (errors) {
                    for (let e of errors) {
                        this.log(`moved media failed: ${e.error} for ${e.mediaPath}`);
                    }
                } else {
                    this.log(`moved media with type ${type} to destination ${fileGroup.name}`);
                }
            }),
            catchError(this.handleError<MediaMoveError[]>("moveMedia"))
        );
    }

    moveAllMedia(fileGroups: MediaFileGroup[], type: MediaFileType): Observable<MediaMoveError[]> {
        const url = `${environment.commanderApiUrl}/media-moves/all`;
        const req: MediaMoveRequest[] = fileGroups.map(fileGroup => { return { fileGroup, type } });
        return this.http.post<MediaMoveError[]>(url, req, this.httpOptions).pipe(
            tap(errors => {
                if (isNotEmptyArray(errors)) {
                    for (let e of errors) {
                        this.log(`moved media failed: ${e.error} for ${e.mediaPath}`);
                    }
                } else {
                    this.log(`moved all media with type ${type}`);
                }
            }),
            catchError(this.handleError<MediaMoveError[]>("moveAllMedia"))
        );
    }
}

export function isNotEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length > 0;
}
