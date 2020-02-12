import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/entity/match';
import { PickerController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { MatchService } from 'src/app/services/match.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  match: Match;

  constructor(
    private pickerController: PickerController,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.match = new Match();
    const matchId = this.route.snapshot.params.id;
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
    this.showToast('Aluno excluído');
    this.router.navigateByUrl('/matchs');
  }

  async done() {
    if (this.match.id) {
      await this.matchService.updateMatch(this.match, this.match.id);
    } else {
      await this.matchService.addMatch(this.match);
    }
    this.showToast('Pronto');
    this.router.navigateByUrl('/matchs');
  }

}
