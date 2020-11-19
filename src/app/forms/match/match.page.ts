import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/entity/match';
import { PickerController, NavController, LoadingController } from '@ionic/angular';
import { MatchService } from 'src/app/services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/entity/category';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/entity/team';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  categories: Array<Category>;
  match: Match;
  competition: Competition;
  competitionId: string;
  compareWith;
  teams: Array<Team>;

  constructor(
    private pickerController: PickerController,
    private matchService: MatchService,
    private categoryService: CategoryService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.match = new Match();

    this.categoryService.getCategories().subscribe(cat => this.categories = cat);
    this.teamService.getTeams().subscribe(team => this.teams = team);

    const matchId = this.route.snapshot.params.id;
    this.match.competitionId = this.route.snapshot.params.competitionId;
    if (matchId) {
      this.loadMatch(matchId);
    }

    this.compareWith = this.compareWithFn;
  }

  async loadMatch(matchId: string) {
    const loading = await this.loadingController.create({
      message: 'Loading Match..'
    });
    await loading.present();

    this.matchService.getMatch(matchId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.match = res.data() as Match;
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
    this.match.description = `${this.match.homeTeam.name} vs ${this.match.awayTeam.name}`;

    if (this.match.id) {
      await this.matchService.updateMatch(this.match, this.match.id);
    } else {
      await this.matchService.addMatch(this.match);
    }
    this.utilsService.showToast('Pronto');
    this.router.navigateByUrl(`/matches/${this.match.competitionId}`);
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }



}
