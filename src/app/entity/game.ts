import Timer from "easytimer.js";

export class Game {
  public c: number;
  public hasStarted: boolean;
  public hasFinished: boolean;
  public timer: Timer;
  public isPaused: boolean;

  constructor() {}

  startGame() {
    this.hasStarted = true;
    this.timer = new Timer();
    this.timer.start({ precision: "secondTenths" });
  }

  stopGame() {
    this.hasFinished = true;
  }

  currentTime(): string {
    return this.timer
      .getTimeValues()
      .toString(["hours", "minutes", "seconds", "secondTenths"]);
  }

  totalSeconds() {
    return this.timer.getTotalTimeValues().seconds;
  }

  totalSecondTenths() {
    return this.timer.getTotalTimeValues().secondTenths;
  }

  pause() {
    this.isPaused = true;
  }

  unpause() {
    this.isPaused = false;
  }
}
