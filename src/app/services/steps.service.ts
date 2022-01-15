import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action } from "../entity/action";
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

  moveToNextStep(nextStepArg?: number) {
    const stepIndex = nextStepArg || this.currentStep.nextStep;

    if (this.currentStep.nextStep === null) {
      this.gameService.saveAction();
      this.router.navigate([this.gameService.getGameRoute()]);
      return;
    }

    const nextStep = this.steps.find((step) => step.id === stepIndex);

    if (this.currentStep.action !== nextStep.action) {
      this.gameService.saveAction();
      this.gameService.setAction(new Action(nextStep.action));

      if (nextStep.isHidden) {
        const hiddenActionWithDecision = new Action(nextStep.action);
        hiddenActionWithDecision.decision = nextStep.metadata.decision;
        hiddenActionWithDecision.player =
          this.gameService.gameActions[
            this.gameService.gameActions.length - 1
          ].player;
        this.gameService.setAction(hiddenActionWithDecision);
      }

      this.navigateToStepRoute(nextStep);
      return;
    }

    this.navigateToStepRoute(nextStep);
  }

  private navigateToStepRoute(step: Step) {
    this.currentStep = step;

    if (step.isHidden) {
      this.moveToNextStep(step.nextStep);
    }

    this.router.navigate([step.route(this.gameService.category.id)]);
  }
}
