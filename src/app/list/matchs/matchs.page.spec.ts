import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchsPage } from './matchs.page';

describe('MatchsPage', () => {
  let component: MatchsPage;
  let fixture: ComponentFixture<MatchsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
