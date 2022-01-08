import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BeforeGamePage } from "./before-game.page";

describe("BeforeGamePage", () => {
  let component: BeforeGamePage;
  let fixture: ComponentFixture<BeforeGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeforeGamePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
