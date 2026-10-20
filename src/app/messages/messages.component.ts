import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { MessageService } from '../message.service';
import {Message} from "./messages.model";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MessagesComponent implements OnInit {

    messages: Message[] = [];

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.messages = this.messageService.getAll();
    }

    clearMessages() {
        this.messageService.clear();
    }
}
