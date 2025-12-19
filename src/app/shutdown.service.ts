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

    private static readonly shutdownCmd = "shutdown";
    private static readonly rebootCmd = "reboot";
    private static readonly sleepCmd = "sleep";
    private static readonly restartServiceCmd = "restart-service";

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    shutdown(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: ShutdownService.shutdownCmd, params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`shutting down server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    reboot(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: ShutdownService.rebootCmd, params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`reboot server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    sleep(minutes: number): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: ShutdownService.sleepCmd, params: [String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`sleep server in ${minutes} minutes`, resp)),
            catchError(err => this.error(err))
        );
    }

    restartService(minutes: number, serviceName: string): Observable<CommandResponse> {
        const url = `${environment.commanderApiUrl}/commands`;
        let req: CommandRequest = { name: ShutdownService.restartServiceCmd, params: [serviceName, String(minutes)] };
        return this.http.post<CommandResponse>(url, req, this.httpOptions).pipe(
            map(resp => this.mapResponse(`service ${serviceName} restart in ${minutes} minutes`, resp)),
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
