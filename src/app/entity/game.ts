import Timer from 'easytimer.js';


export class Game {

    public time: number;
    public hasStarted: boolean;
    public timer: Timer;

    constructor() { }

    startGame() {
        this.hasStarted = true;
        this.timer = new Timer();
        this.timer.start({ precision: 'secondTenths' });
    }

    currentTime(): string {
        return this.timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']);
    }

    totalSeconds() {
        return this.timer.getTotalTimeValues().seconds;
    }

    totalSecondTenths() {
        return this.timer.getTotalTimeValues().secondTenths;
    }
}
