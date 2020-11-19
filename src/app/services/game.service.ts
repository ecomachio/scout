import { Injectable } from '@angular/core';
import { Match } from '../entity/match';
import { Player } from '../entity/player';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { QueryDocumentSnapshot, AngularFirestore } from 'angularfire2/firestore';
import { Action } from '../entity/action';
import { ActionService } from './action.service';
import { ActionEnum } from '../enum/action.enum';
import { Game } from '../entity/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: Game;
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
    const m = await this.matchService.getMatchPromise(matchId);
    const id = m.id;
    console.log(this.match, m.id, { id, ...m.data() });

    this.match = { id, ...m.data() as Match } as Match;
    
    /* get QueryDocumentSnapshot of players from firebase by category */
    const ps = await this.playerService.getPlayersByCategory(this.match.category.id);

    /* maps the QueryDocumentSnapshot array to players */
    this.players = ps.docs.map((p: QueryDocumentSnapshot<Player>) => {
      const id = p.id;
      return { id, ...p.data() } as Player;
    });
    this.gameActions = [];
    this.game = new Game();
    return this.game;
  }

  getMatch() {
    return this.match;
  }

  getPlayers() {
    return this.players;
  }

  getGame() {
    return this.game;
  }

  getGameTime() {
    return this.game.currentTime();
  }

  addAction(action: Action) {
    action.match = this.match;

    if (action.description === ActionEnum.PLAYEROFTHEMATCH) {
      this.updatePlayerOfTheMatch(action);
    }

    this.gameActions.push(action);
  }

  updatePlayerOfTheMatch(action: Action) {
    this.gameActions.forEach((element, index) => {
      if (element.description === ActionEnum.PLAYEROFTHEMATCH) {
        this.gameActions[index] = action;
      }
    });
  }

  save(match: Match) {
    console.log("gameactions", this.gameActions)
    
    this.gameActions.forEach(a => this.actionService.addAction(a));
    
    match.isFinished = true;    
    this.matchService.updateMatch(match, match.id);    
  }

}
