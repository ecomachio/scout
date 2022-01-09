import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChooseTeamsPage } from "./choose-teams.page";

describe("ChooseTeamsPage", () => {
  let component: ChooseTeamsPage;
  let fixture: ComponentFixture<ChooseTeamsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseTeamsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTeamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
