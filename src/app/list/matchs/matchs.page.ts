import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matchs',
  templateUrl: './matchs.page.html',
  styleUrls: ['./matchs.page.scss'],
})
export class MatchsPage implements OnInit {

  matchs: Array<Match>;

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const competitionId = this.route.snapshot.params.competitionId;
    this.matchService.getCompetitionMatches(competitionId).then(res => {
      console.log(res);
      this.matchs = res.docs.map(m => m.data() as Match);
    });
  }

}
