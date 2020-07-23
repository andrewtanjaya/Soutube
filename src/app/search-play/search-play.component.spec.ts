import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlayComponent } from './search-play.component';

describe('SearchPlayComponent', () => {
  let component: SearchPlayComponent;
  let fixture: ComponentFixture<SearchPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
