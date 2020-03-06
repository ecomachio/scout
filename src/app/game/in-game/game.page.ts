import { Component } from '@angular/core';
import { Game } from '../../entity/game';
import { GameTeam } from '../../entity/gameTeam';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  game: Game;
  gameTime = '00:00:00';

  homeTeam: GameTeam;
  awayTeam: GameTeam;

  gameIntervalId;

  constructor() {
    this.homeTeam = new GameTeam();
    this.awayTeam = new GameTeam();
    this.game = new Game();
  }

  startGame() {
    this.game.startGame();
    this.gameTime = '00:00:00';
    this.homeTeam = new GameTeam();
    this.awayTeam = new GameTeam();
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

    if (team === 'home') {
      this.homeTeam.toogleBallPossession();
      this.awayTeam.pauseBallPossession();
    } else if (team === 'away') {
      this.awayTeam.toogleBallPossession();
      this.homeTeam.pauseBallPossession();
    }

  }



}
