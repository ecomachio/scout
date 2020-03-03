import { Component, OnInit } from '@angular/core';
import { GameTeam } from '../entity/gameTeam';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-choose-players',
  templateUrl: './choose-players.page.html',
  styleUrls: ['./choose-players.page.scss'],
})
export class ChoosePlayersPage implements OnInit {

  players;

  constructor(private router: Router) { }

  ngOnInit() {
    this.players = this.getPlayers(null);
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
