import { Injectable } from '@angular/core';
import { Match } from '../entity/match';
import { Player } from '../entity/player';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  match: Match;
  players: Array<Player>;

  constructor(
    private matchService: MatchService,
    private playerService: PlayerService
  ) {

  }

  /* todo unsubscribe when game is over */
  async initialize(matchId) {
    this.match = (await this.matchService.getMatchPromise(matchId)).data() as Match;

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

  save() {
    console.log(this.match);
    console.log(this.players);
  }

}
