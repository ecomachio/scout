import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.page.html',
  styleUrls: ['./competition.page.scss', '../../../reports.page.scss'],
})
export class CompetitionPage implements OnInit {

  competition:Competition;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
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
    this.competitionService.getCompetition(competitionId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.competition = res.data() as Competition;
      this.competition.id = res.id;
    });
  }

}
