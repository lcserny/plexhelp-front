import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessagesComponent} from './messages.component';
import {TranslateModule} from "@ngx-translate/core";
import {MessageService} from "../message.service";
import {MatCardModule} from "@angular/material/card";
import {Message} from "./messages.model";

describe('MessagesComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;
    let messageService: MessageService;

    const messages: Message[] = [
        { date: new Date('2026-01-01T00:00:00.000Z'), message: 'First message', type: 'INFO' },
        { date: new Date('2026-01-02T00:00:00.000Z'), message: 'Second message', type: 'ERROR' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MessagesComponent],
            imports: [
                TranslateModule.forRoot(),
                MatCardModule
            ],
            providers: [MessageService]
        }).compileComponents();

        messageService = TestBed.inject(MessageService);
    });

    function createComponent(): void {
        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create', () => {
        createComponent();

        expect(component).toBeTruthy();
    });

    it('should load messages from the service on init', () => {
        vi.spyOn(messageService, 'getAll').mockReturnValue(messages);

        createComponent();

        expect(messageService.getAll).toHaveBeenCalled();
        expect(component.messages).toEqual(messages);
    });

    it('should render the messages', () => {
        vi.spyOn(messageService, 'getAll').mockReturnValue(messages);

        createComponent();

        const cards = fixture.nativeElement.querySelectorAll('mat-card');
        expect(cards.length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('First message');
        expect(fixture.nativeElement.textContent).toContain('Second message');
    });

    it('should clear the messages when clearMessages is called', () => {
        const clearSpy = vi.spyOn(messageService, 'clear');
        createComponent();

        component.clearMessages();

        expect(clearSpy).toHaveBeenCalled();
    });

    it('should clear the messages when the clear button is clicked', () => {
        const clearSpy = vi.spyOn(messageService, 'clear');
        createComponent();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('#clear-btn');
        button.click();

        expect(clearSpy).toHaveBeenCalled();
    });
});
