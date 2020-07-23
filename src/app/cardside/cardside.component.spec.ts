import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsideComponent } from './cardside.component';

describe('CardsideComponent', () => {
  let component: CardsideComponent;
  let fixture: ComponentFixture<CardsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
