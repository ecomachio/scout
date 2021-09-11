import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Game } from '../../entity/game';
import { GameTeam } from '../../entity/gameTeam';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { ActionEnum } from 'src/app/enum/action.enum';
import { AlertController, IonBackButtonDelegate, ModalController, NavController } from '@ionic/angular';
import { OtherModulesComponent } from 'src/app/compenents/other-modules/other-modules.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

  unsubscribe$: Subject<void> = new Subject<void>();

  match: Match = new Match();

  gameTime = '00:00:00';

  homeTeam: GameTeam;
  awayTeam: GameTeam;

  gameIntervalId;
  game: Game;
  gameReady = false;

  get actionEnum() { return ActionEnum; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchService: MatchService,
    private gameService: GameService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {

  }

  async ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;

    this.gameReady = await this.setupMatch(matchId);

    this.setUIBackButtonAction();
  }

  async setupMatch(matchId) {
    this.game = await this.gameService.initialize(matchId);
    this.match = this.gameService.match;

    console.log(this.match);
    this.awayTeam = new GameTeam();
    Object.assign(this.awayTeam, this.match.awayTeam);
    console.log(this.awayTeam);

    this.homeTeam = new GameTeam();
    Object.assign(this.homeTeam, this.match.homeTeam);
    console.log(this.homeTeam);
    console.log(this.homeTeam.name);

    this.match.isStarted = true;
    this.match.score.home = 0;
    this.match.score.away = 0;
    return true;
  }

  startGame() {
    this.game.startGame();
    this.gameTime = '00:00:00';
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

    this.game.stopGame();
    this.homeTeam.ballPossessionTimer.pause();
    this.awayTeam.ballPossessionTimer.pause();
    this.game.timer.pause();

    this.match.awayTeamBallPossessionRate = this.awayTeam.ballPossessionRate;
    this.match.homeTeamBallPossessionRate = this.homeTeam.ballPossessionRate;

    this.match.homeTeamballPossessionTime = this.homeTeam.ballPossessionTime;
    this.match.awayTeamballPossessionTime = this.awayTeam.ballPossessionTime;

    this.gameService.save(this.match);
    clearInterval(this.gameIntervalId);

    this.router.navigateByUrl(`after-game/${this.match.id}`);
  }

  validateAction() {
    /*if (this.game.isPaused) {
      this.utilsService.showToast('Partida pausada');
      throw new Error('gameisPausedException');
    }*/

    if (!this.game.hasStarted) {
      throw new Error('gameNotStartedException');
    }
    if (this.game.hasFinished) {
      throw new Error('gameHasFinishedException');
    }
  }

  resetGameTime() {
    clearInterval(this.gameIntervalId);
  }

  setBallPossession(team: string) {
    this.validateAction();
    console.log(this.gameService.players);

    if (this.game.isPaused) {
      this.utilsService.showToast('Partida pausada');
      throw new Error('gameisPausedException');
    }

    if (team === 'home') {
      this.homeTeam.toogleBallPossession();
      this.awayTeam.pauseBallPossession();
    } else if (team === 'away') {
      this.awayTeam.toogleBallPossession();
      this.homeTeam.pauseBallPossession();
    }

  }

  choosePlayers(action) {
    let step;
    this.validateAction();

    switch (action) {
      case ActionEnum.TACKLE:
        step = 1;
        this.setBallPossession('home');
        break;
      case ActionEnum.PASS:
        step = 1;
        this.setBallPossession('away');
        break;
      case ActionEnum.FOUL:
        step = 1;
        if (this.homeTeam.hasPossession) {
          this.setBallPossession('away');
        } else {
          this.setBallPossession('home');
        }
        break;
      case ActionEnum.GOALKEEPERSAVE:
        step = 1;
        break;
      default:
        step = 2;
        break;
    }

    this.router.navigate([`choose-players/${this.match.category.id}`], { queryParams: { action, step } });
  }

  async otherModules() {

    this.validateAction();

    const modal = await this.modalController.create({
      component: OtherModulesComponent,
      componentProps: {
        match: this.match,
        game: this.game,
      },
      animated: true
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data.isGameStoped) {
      this.stopGame();
    }

  }

  ngOnDestroy() {
    /* this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe(); */
  }

  pauseGame() {
    if (this.homeTeam.hasPossession) {
      this.homeTeam.ballPossessionTimer.pause();
    }

    if (this.awayTeam.hasPossession) {
      this.awayTeam.ballPossessionTimer.pause();
    }

    this.game.timer.pause();
    this.game.pause();
  }

  unpauseGame() {
    if (this.homeTeam.hasPossession) {
      this.homeTeam.ballPossessionTimer.start();
    }

    if (this.awayTeam.hasPossession) {
      this.awayTeam.ballPossessionTimer.start();
    }

    this.game.timer.start();
    this.game.unpause();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Sair da partida?',
      message: 'Os dados não serão salvos!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',          
        }, {
          cssClass: 'primary',     
          text: 'Sair',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ]
    });

    await alert.present();
  }

  setUIBackButtonAction() {
    this.backButton.onClick = async () => {
      await this.presentAlertConfirm();
    };
  }

}
