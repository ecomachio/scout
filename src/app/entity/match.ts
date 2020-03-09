import { Player } from './player';
import { Category } from './category';

export class Match {

    id: string;
    homeTeam: string; // team maybe
    awayTeam: string; // team maybe
    competitionId: string;
    description: string;

    score: Score = new Score();
    location: string;
    date: Date;
    playerOfTheMatch: Player;
    notes: string;

    category: Category;

    // game controls
    isStarted: boolean;
}

class Score {

    home: number;
    away: number;

    constructor() {
        this.home = 0;
        this.away = 0;
    }

}
