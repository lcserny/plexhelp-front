import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { CommandRequest, CommandResponse } from './generated';
import { BaseService } from './base.service';
import { CommanderApiUrlResolver } from 'src/environments/commander.resolver';

@Injectable({
    providedIn: 'root'
})
export class ShutdownService extends BaseService {

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient, protected override messageService: MessageService, private commanderResolver: CommanderApiUrlResolver) {
        super(messageService);
    }

    // TODO: impl seconds
    shutdown(): Observable<CommandResponse> {
        let seconds = 0;
        const url = `${this.commanderResolver.produceCommanderApiUrlBase()}/v1/commands`;
        console.log(url);
        let req: CommandRequest = { name: "shutdown" };
        return this.http.post<CommandResponse>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`shutting down server in ${seconds} seconds`)),
                catchError(this.handleError<CommandResponse>("shutdown"))
            );
    }

    reboot(): Observable<CommandResponse> {
        const url = `${this.commanderResolver.produceCommanderApiUrlBase()}/v1/commands`;
        console.log(url);
        let req: CommandRequest = { name: "reboot" };
        return this.http.post<CommandResponse>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`rebooting server`)),
                catchError(this.handleError<CommandResponse>("reboot"))
            );
    }
}
