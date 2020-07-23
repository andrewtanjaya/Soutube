import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingCatDetailComponent } from './gaming-cat-detail.component';

describe('GamingCatDetailComponent', () => {
  let component: GamingCatDetailComponent;
  let fixture: ComponentFixture<GamingCatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamingCatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamingCatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
