import { Component, OnInit } from '@angular/core';
import { GameTeam } from '../../entity/gameTeam';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/entity/player';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { GameService } from 'src/app/services/game.service';
import { Location } from '@angular/common';
import { Action } from 'src/app/entity/action';
import { ActionService } from 'src/app/services/action.service';
import { ActionEnum } from 'src/app/enum/action.enum';
import { ThrowStmt } from '@angular/compiler';
import { PositionEnum } from 'src/app/enum/Position.enum';
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

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private actionService: ActionService,
    private location: Location
  ) { }

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;

    const qpAction = this.route.snapshot.queryParamMap.get('action');
    this.steps = parseInt(this.route.snapshot.queryParamMap.get('step'));

    this.choosePlayerStep = true;

    this.selectedAction = new Action(qpAction);
    this.players = this.gameService.players;
    this.match = this.gameService.getMatch();
    this.homeTeam = this.gameService.getMatch().homeTeam;
    this.awayTeam = this.gameService.getMatch().awayTeam;
    console.log(this.homeTeam)
    console.log(this.awayTeam)

    if (this.selectedAction.description === ActionEnum.GOALKEEPERSAVE) {
      this.players = this.players.filter(p => p.position === PositionEnum.GK);
    }

    if (this.selectedAction.description === ActionEnum.GOAL) {
      this.showGoalStep();
    }

    console.log(this.players);
    console.log(this.gameService.match);

  }

  onPlayerChoose(e: Player) {
    this.selectedPlayer = this.players.find((p: Player) => p.id === e.id);
    if (this.steps == 2)
      this.showConfirmationStep();
    else this.done();
  }

  onConfirmed(decision: boolean) {
    this.done(decision);
  }

  done(decision?: boolean) {
    this.selectedAction.steps = this.steps;
    this.selectedAction.decision = decision || true;
    this.selectedAction.player = this.selectedPlayer;

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
      this.location.back();
    }

  }

  setGoal(team: Team): void {
    if (team.id == this.homeTeam.id) {
      this.match.score.home++;
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
    this.confirmationStep = true;
  }

}
