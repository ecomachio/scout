import { Injectable } from '@angular/core';
import { Match } from '../entity/match';
import { Player } from '../entity/player';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { QueryDocumentSnapshot, AngularFirestore } from 'angularfire2/firestore';
import { Action } from '../entity/action';
import { ActionService } from './action.service';
import { ActionEnum } from '../enum/action.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  match: Match;
  players: Array<Player>;
  gameActions: Array<Action> = new Array();

  constructor(
    private matchService: MatchService,
    private playerService: PlayerService,
    private actionService: ActionService,
  ) {

  }

  /* todo unsubscribe when game is over */
  async initialize(matchId) {
    this.match = new Match();
    this.match = (await this.matchService.getMatchPromise(matchId)).data() as Match;
    console.log(this.match);
    /* get QueryDocumentSnapshot of players from firebase by category */
    const ps = await this.playerService.getPlayersByCategory(this.match.category.id);

    /* maps the QueryDocumentSnapshot array to players */
    this.players = ps.docs.map((m: QueryDocumentSnapshot<Player>) => {
      const id = m.id;
      return { id, ...m.data() } as Player;
    });
  }

  getMatch() {
    return this.match;
  }

  getPlayers() {
    return this.players;
  }

  addAction(action: Action) {
    action.match = this.match;

    if (action.description === ActionEnum.PLAYEROFTHEMATCH) {
      this.updatePlayerOfTheMatch(action);
    }

    this.gameActions.push(action);
  }

  updatePlayerOfTheMatch(action: Action){
    this.gameActions.forEach((element, index) => {
      if (element.description === ActionEnum.PLAYEROFTHEMATCH) {
        this.gameActions[index] = action;
      }
    });
  }

  save(match: Match) {
    console.log(this.gameActions)
    this.gameActions.forEach(a => this.actionService.addAction(a));
    this.matchService.updateMatch(match, match.id);
    console.log(this.players);
  }

}
