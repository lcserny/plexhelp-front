import {TestBed} from '@angular/core/testing';

import {SecurityService} from './security.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('SecurityService', () => {
    let service: SecurityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(SecurityService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
