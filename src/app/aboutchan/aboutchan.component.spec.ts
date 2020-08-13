import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutchanComponent } from './aboutchan.component';

describe('AboutchanComponent', () => {
  let component: AboutchanComponent;
  let fixture: ComponentFixture<AboutchanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutchanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutchanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
