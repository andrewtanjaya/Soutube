import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportCategoryDetailComponent } from './sport-category-detail.component';

describe('SportCategoryDetailComponent', () => {
  let component: SportCategoryDetailComponent;
  let fixture: ComponentFixture<SportCategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportCategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
