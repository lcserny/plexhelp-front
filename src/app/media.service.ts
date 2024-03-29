import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MediaFileGroup, MediaFileType, MediaMoveError, MediaMoveReq, MediaRenameRequest, RenamedMediaOptions } from './generated';
import { MessageService } from './message.service';
import { BaseService } from './base.service';
import { CommanderApiUrlResolver } from 'src/environments/commander.resolver';

@Injectable({
    providedIn: 'root'
})
export class MediaService extends BaseService {

    private currentSearch: MediaFileGroup[] = [];

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient, protected override messageService: MessageService, private commanderResolver: CommanderApiUrlResolver) {
        super(messageService);
    }

    getMediaFileGroup(index: number): MediaFileGroup {
        return this.currentSearch[index];
    }

    searchMedia(): Observable<MediaFileGroup[]> {
        const url = `${this.commanderResolver.produceCommanderApiUrlBase()}/v1/media-searches`;
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
        const url = `${this.commanderResolver.produceCommanderApiUrlBase()}/v1/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`generated media options for ${name} with type ${type} and origin ${opts.origin}`)),
                catchError(this.handleError<RenamedMediaOptions>("generateNameOptions"))
            );
    }

    moveMedia(fileGroup: MediaFileGroup, type: MediaFileType): Observable<MediaMoveError[]> {
        const url = `${this.commanderResolver.produceCommanderApiUrlBase()}/v1/media-moves`;
        let req: MediaMoveReq = { fileGroup, type };
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
