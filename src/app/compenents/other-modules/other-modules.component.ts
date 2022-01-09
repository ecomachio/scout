import { Component, OnInit, Input, OnDestroy, Output } from "@angular/core";
import { ActionEnum } from "src/app/enum/action.enum";
import { Match } from "src/app/entity/match";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { fromEvent, Subscription } from "rxjs";
import { Game } from "src/app/entity/game";
import { ACTION_STEP_CONFIG, Action } from "src/app/entity/action";
import { GameService } from "src/app/services/game.service";
import { StepsService } from "src/app/services/steps.service";

@Component({
  selector: "app-other-modules",
  templateUrl: "./other-modules.component.html",
  styleUrls: ["./other-modules.component.scss"],
})
export class OtherModulesComponent implements OnInit {
  @Input() match: Match;
  @Input() game: Game;

  get actionEnum() {
    return ActionEnum;
  }

  private backbuttonSubscription: Subscription;
  private isGameStopped = false;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private gameService: GameService,
    private stepsService: StepsService
  ) {}

  ngOnInit() {}

  choosePlayers(actionDescription) {
    this.stepsService.initialize(ACTION_STEP_CONFIG[actionDescription].steps);

    const action = new Action(actionDescription);
    action.matchTime = this.gameService.getGameTime();

    this.gameService.setAction(action);

    const route = this.stepsService
      .getCurrentStep()
      .route(this.gameService.category.id);

    this.router.navigate([route]);
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      isGameStopped: this.isGameStopped,
    });
  }

  stopGame() {
    this.isGameStopped = true;
    this.dismiss();
  }
}
