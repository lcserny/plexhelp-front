import {TestBed} from '@angular/core/testing';

import {MagnetService} from './magnet.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('MagnetService', () => {
    let service: MagnetService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.inject(MagnetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
