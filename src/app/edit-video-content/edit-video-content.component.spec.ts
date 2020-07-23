import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideoContentComponent } from './edit-video-content.component';

describe('EditVideoContentComponent', () => {
  let component: EditVideoContentComponent;
  let fixture: ComponentFixture<EditVideoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVideoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVideoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
