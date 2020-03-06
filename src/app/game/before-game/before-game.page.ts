import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/entity/competition';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';

@Component({
  selector: 'app-before-game',
  templateUrl: './before-game.page.html',
  styleUrls: ['./before-game.page.scss'],
})
export class BeforeGamePage implements OnInit {

  competitions: Array<Competition>;

  constructor(
    private competitionsService: CompetitionService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.competitionsService.getCompetitions().subscribe(res => this.competitions = res);
  }

}
