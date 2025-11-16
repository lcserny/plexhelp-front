import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessagesComponent} from './messages.component';
import {TranslateModule} from "@ngx-translate/core";
import {MessageService} from "../message.service";
import {MatCardModule} from "@angular/material/card";

describe('MessagesComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MessagesComponent],
            imports: [
                TranslateModule.forRoot(),
                MatCardModule
            ],
            providers: [MessageService]
        }).compileComponents();

        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
