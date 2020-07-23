import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideQueueComponent } from './side-queue.component';

describe('SideQueueComponent', () => {
  let component: SideQueueComponent;
  let fixture: ComponentFixture<SideQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
