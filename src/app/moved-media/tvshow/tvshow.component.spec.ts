import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovedMediaTVShowComponent } from './tvshow.component';

describe('TvshowComponent', () => {
  let component: MovedMediaTVShowComponent;
  let fixture: ComponentFixture<MovedMediaTVShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovedMediaTVShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovedMediaTVShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
