import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
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
            tap(page => this.log(`${page.content.length} magnets retrieved`)),
            catchError(this.handleErrorWith<PaginatedMagnets>("getAllMagnets", () => {}, {
                content: [],
                page: {
                    size: 0,
                    number: 0,
                    totalElements: 0,
                    totalPages: 0
                }
            }))
        );
    }

    addMagnet(link: string): Observable<MagnetData> {
        return this.http.post<MagnetData>(`${environment.commanderApiUrl}/magnets`, link, this.httpOptions).pipe(
            map((magnet) => {
                this.log(`added magnet ${link.substring(0, 50)}`);
                return magnet;
            }),
            catchError(this.handleError<MagnetData>("addMagnet"))
        );
    }
}
