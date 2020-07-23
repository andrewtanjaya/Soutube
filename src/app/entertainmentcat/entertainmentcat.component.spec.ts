import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentcatComponent } from './entertainmentcat.component';

describe('EntertainmentcatComponent', () => {
  let component: EntertainmentcatComponent;
  let fixture: ComponentFixture<EntertainmentcatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertainmentcatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertainmentcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
