import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchcontentComponent } from './searchcontent.component';

describe('SearchcontentComponent', () => {
  let component: SearchcontentComponent;
  let fixture: ComponentFixture<SearchcontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchcontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
