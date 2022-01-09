import { Component, OnInit } from "@angular/core";
import { Action } from "src/app/entity/action";

import { Match } from "src/app/entity/match";
import { Team } from "src/app/entity/team";
import { GameService } from "src/app/services/game.service";
import { StepsService } from "src/app/services/steps.service";

@Component({
  selector: "app-choose-teams",
  templateUrl: "./choose-teams.page.html",
  styleUrls: ["../choose-players/choose-players.page.scss"],
})
export class ChooseTeamsPage implements OnInit {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  selectedAction: Action;

  constructor(
    private gameService: GameService,
    private stepsService: StepsService
  ) {}

  ngOnInit() {
    this.selectedAction = new Action(this.stepsService.currentStep.action);
    this.match = this.gameService.getMatch();
    this.homeTeam = this.match.homeTeam;
    this.awayTeam = this.match.awayTeam;
  }

  done(team: Team) {
    this.stepsService.moveToNextStep();
  }
}
