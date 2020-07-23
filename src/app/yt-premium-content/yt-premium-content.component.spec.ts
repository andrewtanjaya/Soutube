import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtPremiumContentComponent } from './yt-premium-content.component';

describe('YtPremiumContentComponent', () => {
  let component: YtPremiumContentComponent;
  let fixture: ComponentFixture<YtPremiumContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtPremiumContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtPremiumContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
