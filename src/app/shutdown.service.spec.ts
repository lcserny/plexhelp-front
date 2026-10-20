import { TestBed } from '@angular/core/testing';

import { ShutdownService } from './shutdown.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ShutdownService', () => {
  let service: ShutdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ShutdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
