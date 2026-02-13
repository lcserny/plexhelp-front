import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovedMediaSearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: MovedMediaSearchComponent;
  let fixture: ComponentFixture<MovedMediaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovedMediaSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovedMediaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
