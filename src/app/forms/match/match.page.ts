import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/entity/match';
import { PickerController, NavController, LoadingController } from '@ionic/angular';
import { MatchService } from 'src/app/services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  match: Match;
  competition: Competition;
  competitionId: string;

  constructor(
    private pickerController: PickerController,
    private matchService: MatchService,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.match = new Match();
    const matchId = this.route.snapshot.params.id;
    this.match.competitionId = this.route.snapshot.params.competitionId;
    if (matchId) {
      this.loadMatch(matchId);
    }
  }

  async loadMatch(matchId) {
    const loading = await this.loadingController.create({
      message: 'Loading Match..'
    });
    await loading.present();

    this.matchService.getMatch(matchId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.match = res;
      this.match.id = matchId;
    });
  }

  async removeMatch() {
    if (this.match.id) {
      await this.matchService.removeMatch(this.match.id);
    }
    this.utilsService.showToast('Aluno excluído');
    this.router.navigateByUrl('/matches');
  }

  async done() {
    this.match.description = `${this.match.homeTeam} vs ${this.match.awayTeam}`;

    if (this.match.id) {
      await this.matchService.updateMatch(this.match, this.match.id);
    } else {
      await this.matchService.addMatch(this.match);
    }
    this.utilsService.showToast('Pronto');
    this.router.navigateByUrl(`/matches/${this.match.competitionId}`);
  }

}
