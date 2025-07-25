import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {

    messages: string[] = [];

    add(message: string): void {
        this.messages.push(new Date().toLocaleString() + ": " + message);
    }

    clear(): void {
        this.messages = [];
    }
}
