import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcatdetailComponent } from './newcatdetail.component';

describe('NewcatdetailComponent', () => {
  let component: NewcatdetailComponent;
  let fixture: ComponentFixture<NewcatdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcatdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcatdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
