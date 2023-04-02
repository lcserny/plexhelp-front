import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MediaFileGroup, MediaFileType, MediaRenameRequest, RenamedMediaOptions } from './generated';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    private mediaBaseUrl = environment.commanderApiUrlBase;
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient) { }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    searchMedia(): Observable<MediaFileGroup[]> {
        const url = `${this.mediaBaseUrl}/v1/media-searches`;
        return this.http.get<MediaFileGroup[]>(url)
            .pipe(
                tap(_ => console.log('fetched media')),
                catchError(this.handleError<MediaFileGroup[]>("searchMedia", []))
            );
    }

    generateNameOptions(name: string, type: MediaFileType): Observable<RenamedMediaOptions> {
        const url = `${this.mediaBaseUrl}/v1/media-renames`;
        let req: MediaRenameRequest = { name, type };
        return this.http.post<RenamedMediaOptions>(url, req, this.httpOptions)
            .pipe(
                tap(_ => console.log('generated media options')),
                catchError(this.handleError<RenamedMediaOptions>("generateNameOptions"))
            );
    }
}
