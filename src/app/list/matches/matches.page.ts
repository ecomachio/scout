import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { LoadingController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchsPage implements OnInit {

  matches: Array<Match>;
  competitionId: string;

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadMatches();
  }

  private async loadMatches() {
    const loading = await this.loadingController.create({
      message: 'Loading Matches..'
    });
    await loading.present();

    this.competitionId = this.route.snapshot.params.competitionId;
    this.matchService.getMatchesByCompetition(this.competitionId).then(res => {
      if (!res) {
        this.matches = [];
      }
      this.matches = res.docs.map((m: QueryDocumentSnapshot<Match>) => {
        const id = m.id;
        return { id, ...m.data() } as Match;
      });
      loading.dismiss();
    });
  }

  async remove(item) {
    try {
      await this.matchService.removeMatch(item.id);
      this.loadMatches();
      this.utilsService.showToast('Partida excluída');
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }

  }

}
