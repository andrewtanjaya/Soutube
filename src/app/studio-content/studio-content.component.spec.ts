import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioContentComponent } from './studio-content.component';

describe('StudioContentComponent', () => {
  let component: StudioContentComponent;
  let fixture: ComponentFixture<StudioContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
