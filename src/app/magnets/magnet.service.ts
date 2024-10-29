import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {catchError, Observable} from "rxjs";
import {PaginatedMagnets} from "../generated/commander/model/paginatedMagnets";
import {BaseService} from "../base.service";
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

    getAllMagnets(page: number, perPage: number, sort: string[], name?: string): Observable<PaginatedMagnets> {
        const sortJoined = sort.map(s => `&sort=${s}`).join();
        const nameFilter = name ? `&name=${name}` : "";

        return this.http.get<PaginatedMagnets>(`${environment.commanderApiUrl}/magnets?page=${page}&size=${perPage}${sortJoined}${nameFilter}`, this.httpOptions).pipe(
            map((magnets) => {
                this.log("all magnets retrieved");
                return magnets;
            }),
            catchError(this.handleErrorWith<PaginatedMagnets>("getAllMagnets"), () => {}, {
                content: [],
                page: { totalElements: 0 }
            })
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
