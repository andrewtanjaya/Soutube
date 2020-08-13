import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayQContentComponent } from './play-qcontent.component';

describe('PlayQContentComponent', () => {
  let component: PlayQContentComponent;
  let fixture: ComponentFixture<PlayQContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayQContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayQContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
