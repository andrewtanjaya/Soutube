import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicCategoryComponent } from './music-category.component';

describe('MusicCategoryComponent', () => {
  let component: MusicCategoryComponent;
  let fixture: ComponentFixture<MusicCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
