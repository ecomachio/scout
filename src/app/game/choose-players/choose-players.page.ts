import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/entity/player';
import { Match } from 'src/app/entity/match';
import { GameService } from 'src/app/services/game.service';
import { Location } from '@angular/common';
import { Action } from 'src/app/entity/action';
import { ActionService } from 'src/app/services/action.service';
import { ActionEnum } from 'src/app/enum/action.enum';
import { PositionEnum } from 'src/app/enum/position.enum';
import { Team } from 'src/app/entity/team';

@Component({
  selector: 'app-choose-players',
  templateUrl: './choose-players.page.html',
  styleUrls: ['./choose-players.page.scss'],
})
export class ChoosePlayersPage implements OnInit {

  choosePlayerStep: boolean;
  confirmationStep: boolean;
  goalStep: boolean;

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
    private actionService: ActionService,
    private location: Location
  ) { }

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;

    const qpAction = this.route.snapshot.queryParamMap.get('action');
    this.steps = Number(this.route.snapshot.queryParamMap.get('step'));

    this.choosePlayerStep = true;

    this.selectedAction = new Action(qpAction);
    this.players = this.gameService.players;
    this.match = this.gameService.getMatch();
    this.homeTeam = this.gameService.getMatch().homeTeam;
    this.awayTeam = this.gameService.getMatch().awayTeam;
    console.log(this.homeTeam);
    console.log(this.awayTeam);

    switch (this.selectedAction.description) {
      case ActionEnum.GOALKEEPERSAVE:
        this.players = this.players.filter(p => p.position === PositionEnum.GK);
        break;
      case ActionEnum.GOAL:
        this.showGoalStep();
        break;
      case ActionEnum.NOTES:
        this.showNoteStep();
        break;
    }
  }

  onPlayerChoose(e: Player) {
    this.selectedPlayer = this.players.find((p: Player) => p.id === e.id);
    if (this.steps === 2) {
      this.showConfirmationStep();
    } else {
      this.done(true);
    }
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
    this.selectedAction.player = this.selectedPlayer || { ...new Player() };
    this.gameService.addAction(this.selectedAction);

    this.location.back();
  }

  showGoalStep() {
    this.choosePlayerStep = false;
    this.goalStep = true;
    this.confirmationStep = false;
  }

  onGoalConfirmed(team: Team) {
    this.hideGoalStep();
    this.setGoal(team);

    if (team.isMainTeam) {
      this.choosePlayerStep = true;
    } else {
      this.done(false);
    }

  }

  setGoal(team: Team): void {
    if (team.id === this.homeTeam.id) {
      this.match.score.home++;

      // every goal is also a shot on target
      let shotAction: Action = new Action();
      shotAction = { ...this.selectedAction };
      shotAction.description = ActionEnum.FINISH;
      shotAction.decision = true;
      this.gameService.addAction(shotAction);

    } else {
      this.match.score.away++;
    }
  }

  hideGoalStep() {
    this.goalStep = false;
  }

  showConfirmationStep() {
    this.choosePlayerStep = false;
    this.goalStep = false;
    this.noteStep = false;
    this.confirmationStep = true;
  }

  showNoteStep() {
    this.choosePlayerStep = false;
    this.goalStep = false;
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
