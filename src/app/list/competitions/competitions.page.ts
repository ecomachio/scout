import { Component, OnInit } from '@angular/core';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.page.html',
  styleUrls: ['./competitions.page.scss'],
})
export class CompetitionsPage implements OnInit {

  competitions: Array<Competition>;

  constructor(private competitionsService: CompetitionService) { }

  ngOnInit() {
    this.competitionsService.getCompetitions().subscribe(res => {
      console.log(res);
      this.competitions = res;
    });
  }

}
