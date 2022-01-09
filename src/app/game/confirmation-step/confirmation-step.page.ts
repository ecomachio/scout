import { Component, OnInit } from "@angular/core";
import { Action } from "src/app/entity/action";
import { Player } from "src/app/entity/player";
import { GameService } from "src/app/services/game.service";
import { StepsService } from "src/app/services/steps.service";

@Component({
  selector: "app-confirmation-step",
  templateUrl: "./confirmation-step.page.html",
  styleUrls: ["./confirmation-step.page.scss"],
})
export class ConfirmationStepPage implements OnInit {
  selectedAction: Action;
  selectedPlayer: Player;

  constructor(
    private gameService: GameService,
    private stepsService: StepsService
  ) {}

  ngOnInit() {
    this.selectedAction = new Action(this.stepsService.currentStep.action);
    this.selectedPlayer = this.gameService.action.player;
  }

  done(decision) {
    this.gameService.setAction({
      ...this.gameService.action,
      decision,
    } as Action);
    this.stepsService.moveToNextStep();
  }
}
