import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitycardComponent } from './communitycard.component';

describe('CommunitycardComponent', () => {
  let component: CommunitycardComponent;
  let fixture: ComponentFixture<CommunitycardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitycardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
