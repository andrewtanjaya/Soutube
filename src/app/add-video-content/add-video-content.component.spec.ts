import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoContentComponent } from './add-video-content.component';

describe('AddVideoContentComponent', () => {
  let component: AddVideoContentComponent;
  let fixture: ComponentFixture<AddVideoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
