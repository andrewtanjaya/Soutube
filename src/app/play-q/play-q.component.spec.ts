import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayQComponent } from './play-q.component';

describe('PlayQComponent', () => {
  let component: PlayQComponent;
  let fixture: ComponentFixture<PlayQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
