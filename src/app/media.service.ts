import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MediaFileGroup, MediaFileType, MediaMoveError, MediaMoveRequest, MediaRenameRequest, RenamedMediaOptions } from './generated';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    private currentSearch: MediaFileGroup[] = [];

    private mediaBaseUrl = environment.commanderApiUrlBase;
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient, private messageService: MessageService) { }

    private log(message: string) {
        this.messageService.add(`MediaService: ${message}`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    getMediaFileGroup(index: number): MediaFileGroup {
        return this.currentSearch[index];
    }

    searchMedia(): Observable<MediaFileGroup[]> {
        const url = `${this.mediaBaseUrl}/v1/media-searches`;
        return this.http.get<MediaFileGroup[]>(url)
            .pipe(
                tap(mfgs => {
                    this.currentSearch = mfgs;
                    this.log("searched for media files");
                }),
                catchError(this.handleError<MediaFileGroup[]>("searchMedia", []))
            );
    }

    generateNameOptions(name: string, type: MediaFileType): Observable<RenamedMediaOptions> {
        const url = `${this.mediaBaseUrl}/v1/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`generated media options for ${name} with type ${type} and origin ${opts.origin}`)),
                catchError(this.handleError<RenamedMediaOptions>("generateNameOptions"))
            );
    }

    moveMedia(fileGroup: MediaFileGroup, type: MediaFileType): Observable<MediaMoveError[]> {
        const url = `${this.mediaBaseUrl}/v1/media-moves`;
        let req: MediaMoveRequest = { fileGroup, type };
        return this.http.post<MediaMoveError[]>(url, req, this.httpOptions)
            .pipe(
                tap(errors => {
                    if (Array.isArray(errors) && errors.length > 0) {
                        for (let e of errors) {
                            this.log(`moved media failes: ${e.error} for ${e.mediaPath}`);
                        }
                    } else {
                        this.log(`moved media with type ${type} to destination ${fileGroup.name}`);
                    }
                }),
                catchError(this.handleError<MediaMoveError[]>("moveMedia"))
            );
    }
}
