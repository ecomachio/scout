import { Match } from './match';

export class Competition {

    id: string;
    name: string;
    city: string;
    start: Date;
    end: Date;
    matchs: Array<string> = new Array<string>();

    constructor() {
        this.matchs = ['a', 'b', 'c'];
    }

}
