import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { MessageService } from './message.service';
import { BaseService } from './base.service';
import {environment} from "../environments/environment";
import {CommandResponse} from "./generated/commander/model/commandResponse";
import {CommandRequest} from "./generated/commander/model/commandRequest";
import {Status} from "./generated/commander/model/status";

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
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`shutting down server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    reboot(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: "reboot", params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`reboot server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    sleep(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: "sleep", params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`sleep server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    private mapResponse(message: string, resp: CommandResponse) {
        if (resp.status == Status.Failed || resp.status == Status.NotFound) {
            throw new Error("Command failed or not found");
        }
        this.info(message);
        return resp;
    }
}
