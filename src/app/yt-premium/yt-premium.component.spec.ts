import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtPremiumComponent } from './yt-premium.component';

describe('YtPremiumComponent', () => {
  let component: YtPremiumComponent;
  let fixture: ComponentFixture<YtPremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtPremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
