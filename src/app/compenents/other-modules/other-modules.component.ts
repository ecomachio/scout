import { Component, OnInit, Input, OnDestroy, Output } from "@angular/core";
import { ActionEnum } from "src/app/enum/action.enum";
import { Match } from "src/app/entity/match";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { fromEvent, Subscription } from "rxjs";
import { Game } from "src/app/entity/game";

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
  private isGameStoped = false;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  choosePlayers(action) {
    this.router.navigate([`choose-players/${this.match.category.id}`], {
      queryParams: { action, step: 1 },
    });
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      isGameStoped: this.isGameStoped,
    });
  }

  stopGame() {
    this.isGameStoped = true;
    this.dismiss();
  }
}
