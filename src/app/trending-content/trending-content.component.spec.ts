import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingContentComponent } from './trending-content.component';

describe('TrendingContentComponent', () => {
  let component: TrendingContentComponent;
  let fixture: ComponentFixture<TrendingContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
