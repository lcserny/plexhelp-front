import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovedMediaDetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: MovedMediaDetailComponent;
  let fixture: ComponentFixture<MovedMediaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovedMediaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovedMediaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
