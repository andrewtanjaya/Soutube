import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchvideoComponent } from './searchvideo.component';

describe('SearchvideoComponent', () => {
  let component: SearchvideoComponent;
  let fixture: ComponentFixture<SearchvideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchvideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
