import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovedMediaTVShowSeasonComponent } from './tvshow-season.component';

describe('TvshowSeasonComponent', () => {
  let component: MovedMediaTVShowSeasonComponent;
  let fixture: ComponentFixture<MovedMediaTVShowSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovedMediaTVShowSeasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovedMediaTVShowSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
