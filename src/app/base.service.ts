import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import {Observable} from 'rxjs';
import {ApplicationErrorResponse as authError} from "./generated/auth/model/applicationErrorResponse";
import {ApplicationErrorResponse as apiError} from "./generated/commander/model/applicationErrorResponse";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageType} from "./messages/messages.model";

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService {

    protected constructor(protected messageService: MessageService) { }

    log(message: string, type: MessageType) {
        this.messageService.add(message, type);
    }

    info(message: string) {
        this.log(message, "INFO");
    }

    error(outerError: HttpErrorResponse): Observable<never> {
        const actualError = (outerError.error?.error ?? outerError.error) as (authError | apiError);
        const errorLog = `code=${actualError.code}, type=${actualError.type}, message=${actualError.message}`;
        this.messageService.add(errorLog, "ERROR");
        throw actualError;
    }
}

export class Pageable {

    constructor(public page: number, public perPage: number, public sort: string[] = []) {}

    sortJoined(): string {
        return this.sort.map(s => `&sort=${s}`).join();
    }
}
