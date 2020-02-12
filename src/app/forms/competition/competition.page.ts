import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/entity/competition';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.page.html',
  styleUrls: ['./competition.page.scss'],
})
export class CompetitionPage implements OnInit {

  competition: Competition;

  ngOnInit() {
    this.competition = new Competition();
  }

}
