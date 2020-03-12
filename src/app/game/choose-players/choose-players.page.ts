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

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private actionService: ActionService,
    private location: Location
  ) { }

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;

    const qpAction = this.route.snapshot.queryParamMap.get('action');

    this.selectedAction = new Action(qpAction, this.actionService.getActionDescription(qpAction));
    this.players = this.gameService.players;

    console.log(this.players);
    console.log(this.gameService.match);

  }

  onPlayerChoose(e: Player) {
    this.selectedPlayer = this.players.find((p: Player) => p.id === e.id);
    this.showConfirmationStep();
  }

  onConfirmed(decision: boolean) {

    this.selectedAction.decision = decision;
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
