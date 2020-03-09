import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../entity/game';
import { GameTeam } from '../../entity/gameTeam';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { match } from 'minimatch';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();

  match: Match;

  game: Game;
  gameTime = '00:00:00';

  homeTeam: GameTeam;
  awayTeam: GameTeam;

  gameIntervalId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchService: MatchService
  ) {
    this.homeTeam = new GameTeam();
    this.awayTeam = new GameTeam();
    this.game = new Game();
  }

  ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;
    this.matchService.getMatch(matchId).pipe(takeUntil(this.unsubscribe$)).subscribe(match => {
      this.match = match;

      this.setupMatch();

      this.startGame();
    });
  }

  setupMatch() {
    this.match.isStarted = true;
    this.match.score.home = 0;
    this.match.score.away = 0;
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

  choosePlayers() {
    this.router.navigateByUrl(`choose-players/${this.match.category.id}`);
  }

  ngOnDestroy() {
    /* this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe(); */
  }

}
