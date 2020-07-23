import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentcatdetailComponent } from './entertainmentcatdetail.component';

describe('EntertainmentcatdetailComponent', () => {
  let component: EntertainmentcatdetailComponent;
  let fixture: ComponentFixture<EntertainmentcatdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertainmentcatdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertainmentcatdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
