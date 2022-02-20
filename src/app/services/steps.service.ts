import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Action } from "../entity/action";
import { Step } from "../entity/step";
import { GameService } from "./game.service";

@Injectable({
  providedIn: "root",
})
export class StepsService {
  steps: Step[] = [];
  currentStep: BehaviorSubject<Step> = new BehaviorSubject(this.steps[0]);
  // this action array is going to be saved into gameService on all steps are done
  actions: Action[] = [];

  constructor(private router: Router, private gameService: GameService) {}

  initialize(steps: Step[]) {
    if (steps.length > 0) {
      this.steps = steps;
      this.currentStep.next(this.steps[0]);
    }
  }

  getCurrentStep() {
    return this.currentStep.getValue();
  }

  getCurrentStepSubscription() {
    return this.currentStep.asObservable();
  }

  setCurrentStep(step: Step) {
    this.currentStep.next(step);
  }

  saveAction() {
    const fullAction = this.gameService.fillActionInfo();
    console.log("fullAction", fullAction);
    this.actions.push(fullAction);
  }

  // an action needs to be saved only if all steps are done or there is a change of actions in the steps
  async moveToNextStep(nextStepArg?: number) {
    console.log("moveToNextStep", nextStepArg);
    const currentStep = this.currentStep.getValue();

    const stepIndex = nextStepArg || currentStep.nextStep;

    // all steps are done
    if (currentStep.nextStep === null) {
      if (this.actions.length === 0) {
        this.gameService.setAction(new Action(currentStep.action));
        this.saveAction();
      }
      this.gameService.saveActions(this.actions);
      this.clearSteps();
      this.router.navigate([this.gameService.getGameRoute()]);
      return;
    }
    console.log("nextStepArg", nextStepArg);
    // find the next step in the steps array
    const nextStep = this.steps.find((step) => step.id === stepIndex);

    // if are different actions in the same step, save the current action and move to forward to handle the next action
    if (currentStep.action !== nextStep.action) {
      this.gameService.setAction(new Action(nextStep.action));
      this.saveAction();
      if (nextStep.isHidden) {
        const hiddenActionWithDecision = new Action(nextStep.action);
        hiddenActionWithDecision.decision = nextStep.metadata.decision;
        hiddenActionWithDecision.player =
          this.actions[this.actions.length - 1].player;
        this.gameService.setAction(hiddenActionWithDecision);
        this.saveAction();
      }

      this.navigateToStepRoute(nextStep);
      return;
    }

    this.navigateToStepRoute(nextStep);
  }

  clearSteps() {
    this.steps = [];
    this.setCurrentStep(null);
    this.actions = [];
  }

  private async navigateToStepRoute(step: Step) {
    this.setCurrentStep(step);

    if (step.isHidden) {
      this.moveToNextStep(step.nextStep);
    }

    this.router.navigate([step.route(this.gameService.category.id)]);
  }
}
