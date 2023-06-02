import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(protected messageService: MessageService) { }

    log(message: string) {
        this.messageService.add(`${message}`);
    }

    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
