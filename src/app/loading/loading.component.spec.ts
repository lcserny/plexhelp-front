import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { LoadingService } from '../loading.service';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the spinner when loading turns off without extra change detection', () => {
    loadingService.setLoading(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#loading-container')).toBeTruthy();

    loadingService.setLoading(false);
    // NOTE: no fixture.detectChanges() here — the component refreshes itself.
    expect(fixture.nativeElement.querySelector('#loading-container')).toBeFalsy();
  });
});
