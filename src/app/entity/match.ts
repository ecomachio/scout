import { Player } from './player';

export class Match {

    id: string;
    homeTeam: string; //team maybe
    awayTeam: string; //team maybe

    score: Score = new Score();
    location: string;
    date: Date;
    playerOfTheMatch: Player;
    notes: string;

}

class Score {

    home: number;
    away: number;

    constructor() {
        this.home = 0;
        this.away = 0;
    }

}
