import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingcatdetailComponent } from './travellingcatdetail.component';

describe('TravellingcatdetailComponent', () => {
  let component: TravellingcatdetailComponent;
  let fixture: ComponentFixture<TravellingcatdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravellingcatdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellingcatdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
