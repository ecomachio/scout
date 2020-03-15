import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../entity/game';
import { GameTeam } from '../../entity/gameTeam';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { match } from 'minimatch';
import { GameService } from 'src/app/services/game.service';

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
    private matchService: MatchService,
    private gameService: GameService
  ) {
    this.homeTeam = new GameTeam();
    this.awayTeam = new GameTeam();
    this.game = new Game();
  }

  ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;

    this.setupMatch(matchId);
    this.startGame();

  }

  async setupMatch(matchId) {
    await this.gameService.initialize(matchId);
    this.match = this.gameService.match;

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
    this.validateAction();

    this.gameService.save();
    this.router.navigateByUrl(`after-game/${this.match.id}`);
  }

  validateAction() {
    if (!this.game.hasStarted) {
      throw new Error('gameNotStartedException');
    }

  }

  resetGameTime() {
    clearInterval(this.gameIntervalId);
  }

  setBallPossession(team: string) {
    this.validateAction();
    console.log(this.gameService.players);

    if (team === 'home') {
      this.homeTeam.toogleBallPossession();
      this.awayTeam.pauseBallPossession();
    } else if (team === 'away') {
      this.awayTeam.toogleBallPossession();
      this.homeTeam.pauseBallPossession();
    }

  }

  choosePlayers(action) {
    this.validateAction();
    console.log(this.gameService.getMatch());
    console.log(action);
    this.router.navigate([`choose-players/${this.match.category.id}`], { queryParams: { action } });
  }

  ngOnDestroy() {
    /* this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe(); */
  }

}
