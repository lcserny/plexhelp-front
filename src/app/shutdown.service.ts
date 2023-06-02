import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { CommandRequest, CommandResponse } from './generated';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class ShutdownService extends BaseService {

    private mediaBaseUrl = environment.commanderApiUrlBase
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    // TODO: impl seconds
    shutdown(): Observable<CommandResponse> {
        let seconds = 0;
        const url = `${this.mediaBaseUrl}/v1/commands`;
        let req: CommandRequest = { name: "shutdown", params: [{key: "seconds", value: `${seconds}`}] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`shutting down server in ${seconds} seconds`)),
                catchError(this.handleError<CommandResponse>("shutdown"))
            );
    }
}
