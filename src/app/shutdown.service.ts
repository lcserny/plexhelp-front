import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { CommandRequest, CommandResponse } from './generated';
import { BaseService } from './base.service';
import {environment} from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class ShutdownService extends BaseService {

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    shutdown(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: "shutdown", params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`shutting down server in ${minutes} minutes`)),
                catchError(this.handleError<CommandResponse>("shutdown"))
            );
    }

    reboot(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: "reboot", params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions)
            .pipe(
                tap(opts => this.log(`rebooting server in ${minutes} minutes`)),
                catchError(this.handleError<CommandResponse>("reboot"))
            );
    }
}
