import { Player } from './player';
import { Category } from './category';
import { Team } from './team';
import { Action } from './action';

class Score {

    home: number;
    away: number;

    constructor() {
        this.home = 0;
        this.away = 0;
    }
}

export class Match {

    id: string;
    homeTeam: Team = new Team(); // team maybe
    awayTeam: Team = new Team(); // team maybe
    competitionId: string;
    description: string;

    score: Score = new Score();
    location: string;
    date: Date;
    playerOfTheMatch: Player;
    notes: string;
    awayTeamBallPossessionRate: number;
    homeTeamBallPossessionRate: number;
    awayTeamballPossessionTime: string;
    homeTeamballPossessionTime: string;

    category: Category;

    // game controls
    isStarted: boolean;
    isFinished: boolean;
    gameActions: Array<Action>;

}

