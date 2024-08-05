import { TestBed } from '@angular/core/testing';

import { ShutdownService } from './shutdown.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ShutdownService', () => {
  let service: ShutdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ShutdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
