import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaycardComponent } from './playcard.component';

describe('PlaycardComponent', () => {
  let component: PlaycardComponent;
  let fixture: ComponentFixture<PlaycardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaycardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
