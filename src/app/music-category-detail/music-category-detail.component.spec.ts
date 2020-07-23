import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicCategoryDetailComponent } from './music-category-detail.component';

describe('MusicCategoryDetailComponent', () => {
  let component: MusicCategoryDetailComponent;
  let fixture: ComponentFixture<MusicCategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicCategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
