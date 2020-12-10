import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Match } from 'src/app/entity/match';
import { Player } from 'src/app/entity/player';
import { GameService } from 'src/app/services/game.service';
import { MatchService } from 'src/app/services/match.service';

export interface IPlayerOfTheMach {
  selectedPlayer: Player;
}

@Component({
  selector: 'app-player-of-the-match',
  templateUrl: './player-of-the-match.component.html',
  styleUrls: ['./player-of-the-match.component.scss'],
})
export class PlayerOfTheMatchComponent implements OnInit {

  @Input() step;

  players: Array<Player> = [];
  selectedPlayer: Player;
  match: Match;
  notes: string;

  constructor(
    private gameService: GameService,
    private matchService: MatchService,
    private modalController: ModalController,

  ) { }

  ngOnInit() {
    this.players = this.gameService.players;
    this.match = this.gameService.match;
    this.notes = this.match.notes;
  }

  async onPlayerChoose(e: Player) {
    this.match.playerOfTheMatch = this.players.find((p: Player) => p.id === e.id);
    await this.matchService.updateMatch(this.match, this.match.id);
    this.modalController.dismiss({
      selectedPlayer: this.match.playerOfTheMatch
    });
  }

  async onNoteConfirmed() {
    this.match.notes = this.notes;
    await this.matchService.updateMatch(this.match, this.match.id);
    this.modalController.dismiss({
      notes: this.match.notes
    });
  }

}
