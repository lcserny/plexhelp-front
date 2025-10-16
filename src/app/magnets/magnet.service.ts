import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, tap} from "rxjs";
import {PaginatedMagnets} from "../generated/commander/model/paginatedMagnets";
import {BaseService, Pageable} from "../base.service";
import {MessageService} from "../message.service";
import {MagnetData} from "../generated/commander/model/magnetData";

@Injectable({providedIn: 'root'})
export class MagnetService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'plain/text'}),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    getAllMagnets(pageable: Pageable, name?: string): Observable<PaginatedMagnets> {
        const sortJoined = pageable.sortJoined();
        const nameFilter = name ? `&name=${name}` : "";

        return this.http.get<PaginatedMagnets>(`${environment.commanderApiUrl}/magnets?page=${pageable.page}&size=${pageable.perPage}${sortJoined}${nameFilter}`, this.httpOptions).pipe(
            tap(page => this.info(`${page.content.length} magnet(s) retrieved`)),
            catchError(err => this.error(err))
        );
    }

    addMagnet(link: string): Observable<MagnetData> {
        return this.http.post<MagnetData>(`${environment.commanderApiUrl}/magnets`, link, this.httpOptions).pipe(
            tap(_ => this.info(`added magnet ${link.substring(0, 50)}`)),
            catchError(err => this.error(err))
        );
    }
}
