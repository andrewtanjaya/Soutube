import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiocardComponent } from './studiocard.component';

describe('StudiocardComponent', () => {
  let component: StudiocardComponent;
  let fixture: ComponentFixture<StudiocardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiocardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
