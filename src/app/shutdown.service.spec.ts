import { TestBed } from '@angular/core/testing';

import { ShutdownService } from './shutdown.service';

describe('ShutdownService', () => {
  let service: ShutdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShutdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
