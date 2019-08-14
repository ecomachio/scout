import { Player } from './player';
import Timer from 'easytimer.js';

export class Team {

    public name: string;
    public players: Array<Player>;
    public ballPossession: string;
    public ballPossessionTimer: Timer;
    public hasPossession: boolean;

    constructor() {
        this.ballPossessionTimer = new Timer();
        this.ballPossession = '00:00:00';
    }

    toogleBallPossession() {
        if (this.ballPossessionTimer.isRunning()) {
            this.ballPossessionTimer.pause();
            this.hasPossession = false;
        } else {
            this.ballPossessionTimer.start({ precision: 'secondTenths' });
            this.hasPossession = true;
        }

        this.refresh();
    }

    pauseBallPossession() {
        if (this.ballPossessionTimer.isRunning()) {
            this.ballPossessionTimer.pause();
            this.hasPossession = false;
        }
    }

    refresh() {
        this.ballPossession = this.ballPossessionTimer.getTimeValues().toString();
    }

}
