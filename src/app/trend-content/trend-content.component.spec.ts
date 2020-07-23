import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendContentComponent } from './trend-content.component';

describe('TrendContentComponent', () => {
  let component: TrendContentComponent;
  let fixture: ComponentFixture<TrendContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
