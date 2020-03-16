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

@Component({
  selector: 'app-choose-players',
  templateUrl: './choose-players.page.html',
  styleUrls: ['./choose-players.page.scss'],
})
export class ChoosePlayersPage implements OnInit {

  confirmationStep: boolean;

  players: Array<Player>;
  selectedPlayer: Player;
  selectedAction: Action;
  steps: number;

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

    this.selectedAction = new Action(qpAction);
    this.players = this.gameService.players;

    if (this.selectedAction.description === ActionEnum.GOALKEEPERSAVE) {
      this.players = this.players.filter(p => p.position === PositionEnum.GK);
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

  showConfirmationStep() {
    this.confirmationStep = true;
  }

  hideConfirmationStep() {
    this.confirmationStep = false;
  }
}
