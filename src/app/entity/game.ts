import Timer from 'easytimer.js';


export class Game {

    public time: number;
    public hasStarted: boolean;
    public timer: any;

    constructor() { }

    startGame() {
        this.hasStarted = true;
        this.timer = new Timer();
        this.timer.start();
    }

    currentTime(): string {
        return this.timer.getTimeValues().toString();
    }
}
