import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompetitionsPage } from "./competitions.page";

describe("CompetitionsPage", () => {
  let component: CompetitionsPage;
  let fixture: ComponentFixture<CompetitionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
