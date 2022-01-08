import { Player } from "./player";
import { Match } from "./match";
import { ActionEnum } from "../enum/action.enum";

export class Action {
  id: string;
  name: string;
  description: string;
  decision: boolean;
  player: Player;
  match: Match;
  steps: number;
  matchTime: string;

  constructor(description?: string) {
    this.id = null;
    this.description = description;
    this.decision = null;
  }
}
