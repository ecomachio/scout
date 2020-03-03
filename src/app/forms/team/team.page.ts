import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/entity/team';
import { PickerController, NavController, LoadingController } from '@ionic/angular';
import { TeamService } from 'src/app/services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {

  team: Team;
  competition: Competition;
  competitionId: string;

  constructor(
    private pickerController: PickerController,
    private teamService: TeamService,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.team = new Team();
    const teamId = this.route.snapshot.params.id;
    if (teamId) {
      this.loadTeam(teamId);
    }
  }

  async loadTeam(teamId) {
    const loading = await this.loadingController.create({
      message: 'Loading Team..'
    });
    await loading.present();

    this.teamService.getTeam(teamId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.team = res.data() as Team;
      this.team.id = teamId;
    });
  }

  async removeTeam() {
    if (this.team.id) {
      await this.teamService.removeTeam(this.team.id);
    }
    this.utilsService.showToast('Time excluído');
    this.router.navigateByUrl('/teames');
  }

  async done() {
    if (this.team.id) {
      await this.teamService.updateTeam(this.team, this.team.id);
    } else {
      await this.teamService.addTeam(this.team);
    }
    this.utilsService.showToast('Pronto');
    this.router.navigateByUrl(`/teams`);
  }

}
