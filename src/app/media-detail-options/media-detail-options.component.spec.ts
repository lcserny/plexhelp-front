import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailOptionsComponent } from './media-detail-options.component';

describe('MediaDetailOptionsComponent', () => {
  let component: MediaDetailOptionsComponent;
  let fixture: ComponentFixture<MediaDetailOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaDetailOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
