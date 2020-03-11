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
    private router: Router,
    private playerService: PlayerService,
    private matchService: MatchService,
    private gameService: GameService,
    private location: Location
  ) { }

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;
    this.selectedAction = new Action(this.route.snapshot.queryParamMap.get('action'));
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

    const teste = {
      player: this.selectedPlayer,
      action: this.selectedAction
    };

    console.log(teste);
    this.location.back();
  }

  showConfirmationStep() {
    this.confirmationStep = true;
  }

  hideConfirmationStep() {
    this.confirmationStep = false;
  }

  public getPlayers(team: GameTeam) {

    return [
      { name: 'Joao', number: 1 },
      { name: 'Ricardo', number: 2 },
      { name: 'Paulo', number: 3 },
      { name: 'Lucas', number: 4 },
      { name: 'Tiago', number: 5 },
      { name: 'Rafael', number: 6 },
      { name: 'Paulo', number: 13 },
      { name: 'Lucas', number: 14 },
      { name: 'Tiago', number: 25 },
      { name: 'Rafael', number: 46 },
      { name: 'Willian', number: 57 },
      { name: 'Bruno Dias', number: 48 },
      { name: 'Fernando', number: 79 },
      { name: 'Rafael', number: 46 },
      { name: 'Willian', number: 7 },
      { name: 'Bruno', number: 8 },
      { name: 'Cascavel', number: 9 },
    ]
  }

}
