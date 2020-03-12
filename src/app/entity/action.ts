import { Player } from './player';
import { Match } from './match';

export class Action {

    id: string;
    name: string;
    description: string;
    decision: boolean;
    player: Player;
    match: Match;

    constructor(name?: string, description?: string) {
        this.id = null;
        this.name = name;
        this.description = description;
        this.decision = null;
    }

}
