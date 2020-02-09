import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/entity/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  match: Match;

  constructor() { }

  ngOnInit() {
    this.match = new Match();
  }

}
