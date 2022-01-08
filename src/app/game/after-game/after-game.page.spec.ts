import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AfterGamePage } from "./after-game.page";

describe("AfterGamePage", () => {
  let component: AfterGamePage;
  let fixture: ComponentFixture<AfterGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AfterGamePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
