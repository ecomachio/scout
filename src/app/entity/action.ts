export class Action {

    id: string;
    description: string;
    decision: boolean;

    constructor(description: string) {
        this.id = null;
        this.description = description;
        this.decision = null;
    }

}
