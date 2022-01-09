import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/entity/player";
import { Match } from "src/app/entity/match";
import { GameService } from "src/app/services/game.service";
import { Location } from "@angular/common";
import { Action } from "src/app/entity/action";
import { ActionService } from "src/app/services/action.service";
import { ActionEnum } from "src/app/enum/action.enum";
import { PositionEnum } from "src/app/enum/position.enum";
import { Team } from "src/app/entity/team";
import { ActivatedRoute } from "@angular/router";
import { StepsService } from "src/app/services/steps.service";

@Component({
  selector: "app-choose-players",
  templateUrl: "./choose-players.page.html",
  styleUrls: ["./choose-players.page.scss"],
})
export class ChoosePlayersPage implements OnInit {
  choosePlayerStep: boolean;
  confirmationStep: boolean;
  teamSelectorStep: boolean;

  players: Array<Player>;
  selectedPlayer: Player;
  selectedAction: Action;
  steps: number;
  homeTeam: Team;
  awayTeam: Team;
  match: Match;
  noteStep: boolean;
  notes: string;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private stepsService: StepsService,
    private location: Location
  ) {}

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;

    const qpAction = this.route.snapshot.queryParamMap.get("action");
    this.steps = Number(this.route.snapshot.queryParamMap.get("step"));

    this.choosePlayerStep = true;

    this.selectedAction = new Action(qpAction);
    this.players = this.gameService.players;
    this.match = this.gameService.getMatch();
    this.homeTeam = this.gameService.getMatch().homeTeam;
    this.awayTeam = this.gameService.getMatch().awayTeam;
    console.log(this.homeTeam);

    switch (this.selectedAction.description) {
      case ActionEnum.GOALKEEPERSAVE:
        this.players = this.players.filter(
          (p) => p.position === PositionEnum.GK
        );
        break;
      case ActionEnum.GOAL:
        this.showTeamSelectorStep();
        break;
      case ActionEnum.FOUL:
        this.showTeamSelectorStep();
        break;
      case ActionEnum.NOTES:
        this.showNoteStep();
        break;
    }
  }

  onPlayerChoose(e: Player) {
    this.selectedPlayer = this.players.find((p: Player) => p.id === e.id);
    this.gameService.setAction({
      ...this.gameService.action,
      player: this.selectedPlayer,
    });
    this.stepsService.moveToNextStep();
  }

  onConfirmed(decision: boolean) {
    this.done(decision);
  }

  done(decision?: boolean) {
    this.selectedAction.steps = this.steps;
    this.selectedAction.decision = decision || false;
    this.selectedAction.matchTime = this.gameService.getGameTime();
    console.log(this.gameService.getGameTime());
    console.log(this.gameService.getGame());

    if (this.selectedAction.description === ActionEnum.GOAL) {
      // every goal is also a shot on target
      let shotAction: Action = new Action();
      shotAction = { ...this.selectedAction };
      shotAction.description = ActionEnum.FINISH;
      shotAction.decision = true;
      shotAction.player = this.selectedPlayer || { ...new Player() };
      this.gameService.addAction(shotAction);
    }

    this.selectedAction.player = this.selectedPlayer || { ...new Player() };
    this.gameService.addAction(this.selectedAction);

    this.location.back();
  }

  showTeamSelectorStep() {
    this.choosePlayerStep = false;
    this.teamSelectorStep = true;
    this.confirmationStep = false;
  }

  onTeamConfirmed(team: Team) {
    this.hideTeamSelectorStep();

    if (this.selectedAction.description === ActionEnum.GOAL) {
      this.setGoal(team);
    }

    if (team.isMainTeam) {
      this.choosePlayerStep = true;
    } else {
      this.done(false);
    }
  }

  setGoal(team: Team): void {
    if (team.id === this.homeTeam.id) {
      this.match.score.home++;
    } else {
      this.match.score.away++;
    }
  }

  hideTeamSelectorStep() {
    this.teamSelectorStep = false;
  }

  showConfirmationStep() {
    this.choosePlayerStep = false;
    this.teamSelectorStep = false;
    this.noteStep = false;
    this.confirmationStep = true;
  }

  showNoteStep() {
    this.choosePlayerStep = false;
    this.teamSelectorStep = false;
    this.noteStep = true;
    this.confirmationStep = false;
  }

  hideNoteStep() {
    this.noteStep = false;
  }

  onNoteConfirmed() {
    this.match.notes = this.notes;
    this.location.back();
  }
}
