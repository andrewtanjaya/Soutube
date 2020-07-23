import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDetailContentComponent } from './video-detail-content.component';

describe('VideoDetailContentComponent', () => {
  let component: VideoDetailContentComponent;
  let fixture: ComponentFixture<VideoDetailContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDetailContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
