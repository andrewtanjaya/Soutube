import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubspageComponent } from './subspage.component';

describe('SubspageComponent', () => {
  let component: SubspageComponent;
  let fixture: ComponentFixture<SubspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
