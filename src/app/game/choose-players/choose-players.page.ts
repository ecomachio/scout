import { Component, OnInit } from '@angular/core';
import { GameTeam } from '../../entity/gameTeam';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/entity/player';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';

@Component({
  selector: 'app-choose-players',
  templateUrl: './choose-players.page.html',
  styleUrls: ['./choose-players.page.scss'],
})
export class ChoosePlayersPage implements OnInit {

  players: Array<Player>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private matchService: MatchService
  ) { }

  async ngOnInit() {
    const categoryId = this.route.snapshot.params.categoryId;

    /* todo unsubscribe when game is over */
    /* get QueryDocumentSnapshot of players from firebase by category */
    const ps = await this.playerService.getPlayersByCategory(categoryId);

    /* maps the QueryDocumentSnapshot array to players */
    this.players = ps.docs.map((m: QueryDocumentSnapshot<Player>) => {
      const id = m.id;
      return { id, ...m.data() } as Player;
    });


  }

  onPlayerChoose(e) {
    this.router.navigate(['statistics'], { state: { selectedPlayer: e } } as NavigationExtras);
  }

  public getPlayers(team: GameTeam) {
    console.log("oaishdoihasdhiosa");
    return [
      { name: 'Joao', number: 1 },
      { name: 'Ricardo', number: 2 },
      { name: 'Paulo', number: 3 },
      { name: 'Lucas', number: 4 },
      { name: 'Tiago', number: 5 },
      { name: 'Rafael', number: 6 },
      { name: 'Paulo', number: 13 },
      { name: 'Lucas', number: 14 },
      { name: 'Tiago', number: 25 },
      { name: 'Rafael', number: 46 },
      { name: 'Willian', number: 57 },
      { name: 'Bruno Dias', number: 48 },
      { name: 'Fernando', number: 79 },
      { name: 'Rafael', number: 46 },
      { name: 'Willian', number: 7 },
      { name: 'Bruno', number: 8 },
      { name: 'Cascavel', number: 9 },
    ]
  }

}
