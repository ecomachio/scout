import { Player } from './player';
import { Category } from './category';
import { Team } from './team';

export class Match {

    id: string;
    homeTeam: Team = new Team();; // team maybe
    awayTeam: Team = new Team();; // team maybe
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
