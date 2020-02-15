import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';

@Component({
  selector: 'app-matchs',
  templateUrl: './matchs.page.html',
  styleUrls: ['./matchs.page.scss'],
})
export class MatchsPage implements OnInit {

  matchs: Array<Match>;

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getMatchs().subscribe(res => {
      console.log(res);
      this.matchs = res;
    });
  }

}
