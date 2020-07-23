import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingcatComponent } from './travellingcat.component';

describe('TravellingcatComponent', () => {
  let component: TravellingcatComponent;
  let fixture: ComponentFixture<TravellingcatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravellingcatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellingcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
