import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVideoChannelComponent } from './card-video-channel.component';

describe('CardVideoChannelComponent', () => {
  let component: CardVideoChannelComponent;
  let fixture: ComponentFixture<CardVideoChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardVideoChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardVideoChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
