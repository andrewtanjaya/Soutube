import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChannelComponent } from './video-channel.component';

describe('VideoChannelComponent', () => {
  let component: VideoChannelComponent;
  let fixture: ComponentFixture<VideoChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
