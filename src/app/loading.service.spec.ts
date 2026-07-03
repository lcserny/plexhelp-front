import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unpin after 1 minute', fakeAsync(() => {
    service.setPinnedLoading(true);
    expect(service.getLoading()).toBe(true);

    tick(60000);

    expect(service.getLoading()).toBe(false);
  }));

  it('should not unpin if setPinnedLoading(false) called before 1 minute', fakeAsync(() => {
    service.setPinnedLoading(true);
    expect(service.getLoading()).toBe(true);

    tick(30000);
    service.setPinnedLoading(false);

    tick(30000);
    expect(service.getLoading()).toBe(false);
  }));

  it('should reset timer if setPinnedLoading(true) called again', fakeAsync(() => {
    service.setPinnedLoading(true);
    tick(30000);
    service.setPinnedLoading(true); // reset timer
    
    tick(40000); // 30s + 40s = 70s passed since first start, but timer was reset at 30s
    expect(service.getLoading()).toBe(true); // Should still be true
    
    tick(30000); // 70s + 30s = 100s, total 100s. Should be false now
    expect(service.getLoading()).toBe(false);
  }));
});
