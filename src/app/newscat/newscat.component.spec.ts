import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscatComponent } from './newscat.component';

describe('NewscatComponent', () => {
  let component: NewscatComponent;
  let fixture: ComponentFixture<NewscatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewscatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewscatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
