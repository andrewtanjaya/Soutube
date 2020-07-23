import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingCatComponent } from './gaming-cat.component';

describe('GamingCatComponent', () => {
  let component: GamingCatComponent;
  let fixture: ComponentFixture<GamingCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamingCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamingCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
