import { Player } from './player';
import { Match } from './match';

export class Action {

    id: string;
    description: string;
    decision: boolean;
    player: Player;
    match: Match;

    constructor(description: string) {
        this.id = null;
        this.description = description;
        this.decision = null;
    }

}
