import { Match } from './match';

export class Competition {

    id: string;
    name: string;
    city: string;
    start: Date;
    end: Date;
    matches: Array<Match> = new Array<Match>();

    constructor() {

    }

}
