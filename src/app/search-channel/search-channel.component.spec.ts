import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChannelComponent } from './search-channel.component';

describe('SearchChannelComponent', () => {
  let component: SearchChannelComponent;
  let fixture: ComponentFixture<SearchChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
