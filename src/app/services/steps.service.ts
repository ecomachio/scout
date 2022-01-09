import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Step } from "../entity/step";
import { GameService } from "./game.service";

@Injectable({
  providedIn: "root",
})
export class StepsService {
  steps: Step[] = [];
  currentStep: Step;

  constructor(private router: Router, private gameService: GameService) {}

  initialize(steps: Step[]) {
    if (steps.length > 0) {
      this.steps = steps;
      this.currentStep = this.steps[0];
    }
  }

  getCurrentStep() {
    return this.currentStep;
  }

  moveToNextStep(nextStep?: number) {
    const stepIndex = nextStep || this.currentStep.nextStep;

    if (this.currentStep.nextStep === null) {
      this.gameService.saveAction();
      this.router.navigate([this.gameService.getGameRoute()]);
    } else {
      this.currentStep = this.steps.find((step) => step.id === stepIndex);
      console.log(this.currentStep);
      this.router.navigate([
        this.currentStep.route(this.gameService.category.id),
      ]);
    }
  }
}
