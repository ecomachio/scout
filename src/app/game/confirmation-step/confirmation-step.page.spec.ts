import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmationStepPage } from "./confirmation-step.page";

describe("ConfirmationStepPage", () => {
  let component: ConfirmationStepPage;
  let fixture: ComponentFixture<ConfirmationStepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationStepPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
