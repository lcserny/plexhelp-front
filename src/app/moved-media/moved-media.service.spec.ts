import { TestBed } from '@angular/core/testing';

import { MovedMediaService } from './moved-media.service';

describe('MovedMediaService', () => {
  let service: MovedMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovedMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
