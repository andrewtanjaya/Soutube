import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsideComponent } from './subside.component';

describe('SubsideComponent', () => {
  let component: SubsideComponent;
  let fixture: ComponentFixture<SubsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
