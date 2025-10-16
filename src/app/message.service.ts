import { Injectable } from '@angular/core';
import {Message, MessageType} from "./messages/messages.model";

const MESSAGES = "notificationMessages";

@Injectable({ providedIn: 'root' })
export class MessageService {

    add(message: string, type: MessageType): void {
        const messages: Message[] = this.getAll();
        messages.unshift({ date: new Date(), message, type });
        localStorage.setItem(MESSAGES, JSON.stringify(messages));
    }

    getAll(): Message[] {
        const messages = localStorage.getItem(MESSAGES);
        if (messages) {
            return JSON.parse(messages);
        }
        return [];
    }

    clear(): void {
        localStorage.setItem(MESSAGES, JSON.stringify([]));
    }
}
