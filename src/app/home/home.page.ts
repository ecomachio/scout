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
    this.gameTime = '00:00:00';
    this.homeTeam = new Team();
    this.awayTeam = new Team();
    this.homeTeam.ballPossessionTimer.start({ precision: 'secondTenths' });
    this.homeTeam.hasPossession = true;

    this.gameIntervalId = setInterval(() => {
      this.gameTime = this.game.currentTime();

      this.homeTeam.refresh(this.game);
      this.awayTeam.refresh(this.game);

    }, 10);

    console.log('startGame', this.gameTime);
  }

  stopGame() {
    this.game = new Game();
    this.resetGameTime();
  }

  resetGameTime() {
    clearInterval(this.gameIntervalId);
  }

  setBallPossession(team: string) {
    let t0 = performance.now();

    if (team === 'home') {
      this.homeTeam.toogleBallPossession();
      this.awayTeam.pauseBallPossession();
    } else if (team === 'away') {
      this.awayTeam.toogleBallPossession();
      this.homeTeam.pauseBallPossession();
    }

    let t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
  }



}
