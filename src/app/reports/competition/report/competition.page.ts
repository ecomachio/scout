import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';
import { LoadingController } from '@ionic/angular';
import { Match } from 'src/app/entity/match';
import { MatchService } from 'src/app/services/match.service';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.page.html',
  styleUrls: ['./competition.page.scss', '../../reports.page.scss'],
})
export class CompetitionPage implements OnInit {

  competition: Competition;
  matches: Array<Match> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private matchService: MatchService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.loadCompetition(id);
  }

  async loadCompetition(competitionId) {
    const loading = await this.loadingController.create({
      message: 'Loading Competition..'
    });

    await loading.present();

    this.competitionService.getCompetition(competitionId).subscribe(async res => {
      loading.dismiss();
      this.competition = res.data() as Competition;
      this.competition.id = res.id;

      this.matches = await this.getMatches(this.competition);
    });
  }

  async getMatches(competition) {
    let matches: Array<Match>;
    matches = await this.matchService.getMatchesByCompetition(competition.id).then((res: any) => {
      if (!res) {
        this.matches = [];
      }
      return matches = res.docs.map((m: QueryDocumentSnapshot<Match>) => {
        const id = m.id;
        return { id, ...m.data() } as Match;
      });
    });

    matches.sort((a, b) => {
      if (isNaN(+a.date))
        return 1;
      else if (isNaN(+b.date))
        return -1;
      return +a.date - +b.date
    });

    return matches;
  }

}
