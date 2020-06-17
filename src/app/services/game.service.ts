import { Injectable } from '@angular/core';
import { Match } from '../entity/match';
import { Player } from '../entity/player';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { QueryDocumentSnapshot, AngularFirestore } from 'angularfire2/firestore';
import { Action } from '../entity/action';
import { ActionService } from './action.service';

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
    this.gameActions.push(action);
  }

  save() {
    console.log(this.gameActions)
    this.gameActions.forEach(a => this.actionService.addAction(a));
    console.log(this.players);
  }

}
