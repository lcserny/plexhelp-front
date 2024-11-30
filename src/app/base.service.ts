import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import {ApplicationErrorResponse} from "./generated/auth/model/applicationErrorResponse";

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService {

    protected constructor(protected messageService: MessageService) { }

    log(message: string) {
        this.messageService.add(`${message}`);
    }

    handleError<T>(operation = 'operation', result?: T) {
        return this.handleErrorWith(operation, () => {}, result);
    }

    handleErrorWith<T>(operation = 'operation', process?: () => void, result?: T) {
        return (error: ApplicationErrorResponse): Observable<T> => {
            if (process) {
                process();
            }

            console.error(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
