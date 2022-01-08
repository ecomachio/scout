import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChoosePlayersPage } from "./choose-players.page";

describe("ChoosePlayersPage", () => {
  let component: ChoosePlayersPage;
  let fixture: ComponentFixture<ChoosePlayersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChoosePlayersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
