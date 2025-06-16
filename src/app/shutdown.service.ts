import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { BaseService } from './base.service';
import {environment} from "../environments/environment";
import {CommandResponse} from "./generated/commander/model/commandResponse";
import {CommandRequest} from "./generated/commander/model/commandRequest";

@Injectable({ providedIn: 'root' })
export class ShutdownService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

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
