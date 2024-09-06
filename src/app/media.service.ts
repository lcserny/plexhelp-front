import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MediaFileGroup, MediaFileType, MediaMoveError, MediaMoveRequest, MediaRenameRequest, RenamedMediaOptions } from './generated';
import { MessageService } from './message.service';
import { BaseService } from './base.service';
import {environment} from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class MediaService extends BaseService {

    private currentSearch: MediaFileGroup[] = [];

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    getMediaFileGroup(index: number): MediaFileGroup {
        return this.currentSearch[index];
    }

    searchMedia(): Observable<MediaFileGroup[]> {
        const url = `${environment.commanderApiUrl}/media-searches`;
        return this.http.get<MediaFileGroup[]>(url, this.httpOptions)
            .pipe(
                tap(mfgs => {
                    this.currentSearch = mfgs;
                    this.log("searched for media files");
                }),
                catchError(this.handleError<MediaFileGroup[]>("searchMedia", []))
            );
    }

    generateNameOptions(name: string, type: MediaFileType): Observable<RenamedMediaOptions> {
        const url = `${environment.commanderApiUrl}/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`generated media options for ${name} with type ${type} and origin ${opts.origin}`)),
                catchError(this.handleError<RenamedMediaOptions>("generateNameOptions"))
            );
    }

    moveMedia(fileGroup: MediaFileGroup, type: MediaFileType): Observable<MediaMoveError[]> {
        const url = `${environment.commanderApiUrl}/media-moves`;
        let req: MediaMoveRequest = { fileGroup, type };
        return this.http.post<MediaMoveError[]>(url, req, this.httpOptions)
            .pipe(
                tap(errors => {
                    if (MediaService.isNotEmptyArray(errors)) {
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

    public static isNotEmptyArray(arr: any[]): boolean {
        return Array.isArray(arr) && arr.length > 0;
    }
}
