import { Component } from '@angular/core';
import { Game } from '../entity/game';
import { Team } from '../entity/team';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  game: Game;
  gameTime = '00:00:00';

  homeTeam: Team;
  awayTeam: Team;

  gameIntervalId;

  constructor() {
    this.homeTeam = new Team();
    this.awayTeam = new Team();
    this.game = new Game();
  }

  startGame() {
    this.game.startGame();
    this.homeTeam.ballPossessionTimer.start();
    this.homeTeam.hasPossession = true;

    this.gameIntervalId = setInterval(() => {
      this.gameTime = this.game.currentTime();
      this.homeTeam.refresh();
      this.awayTeam.refresh();
    }, 100);

    console.log('startGame', this.gameTime);
  }

  stopGame() {
    this.game = new Game();
    this.homeTeam = new Team();
    this.awayTeam = new Team();
    this.resetGameTime();
  }

  resetGameTime() {
    this.gameTime = '00:00:00';
    clearInterval(this.gameIntervalId);
  }

  setBallPossession(team: string) {
    if (team === 'home') {
      this.homeTeam.toogleBallPossession();
      this.awayTeam.pauseBallPossession();
    } else if (team === 'away') {
      this.awayTeam.toogleBallPossession();
      this.homeTeam.pauseBallPossession();
    }
  }



}
