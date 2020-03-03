import { Player } from './player';
import Timer from 'easytimer.js';
import { Game } from './game';

export class GameTeam {

    public name: string;
    public players: Array<Player>;
    public ballPossessionTime: string;
    public ballPossessionRate = 0;
    public ballPossessionTimer: Timer;
    public hasPossession: boolean;

    constructor() {
        this.ballPossessionTimer = new Timer();
        this.ballPossessionTime = '00:00:00';
    }

    toogleBallPossession() {
        if (!this.ballPossessionTimer.isRunning()) {
            this.ballPossessionTimer.start({ precision: 'secondTenths' });
            this.hasPossession = true;
        }
    }

    pauseBallPossession() {
        if (this.ballPossessionTimer.isRunning()) {
            this.ballPossessionTimer.pause();
            this.hasPossession = false;
        }
    }

    refresh(game: Game) {
        this.ballPossessionTime = this.ballPossessionTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']);
        this.ballPossessionRate = this.rate(game.totalSecondTenths());
    }

    rate(gameTime: number) {
        // tslint:disable-next-line:max-line-length
        // console.log(this.ballPossessionTimer.getTotalTimeValues().secondTenths + " / " + gameTime + " * " + 100 + " = " + ((((this.ballPossessionTimer.getTotalTimeValues().secondTenths / gameTime) * 100) * 10) / 10).toString());
        return Math.round((((this.ballPossessionTimer.getTotalTimeValues().secondTenths / gameTime) * 100) * 10) / 10);
    }

}
