import { TestBed } from '@angular/core/testing';

import { MovedMediaService } from './moved-media.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DatePipe} from "@angular/common";

describe('MovedMediaService', () => {
  let service: MovedMediaService;

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [DatePipe]
      });
    service = TestBed.inject(MovedMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
