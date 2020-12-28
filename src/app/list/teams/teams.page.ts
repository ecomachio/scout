import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/entity/team';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {

  teams: Array<Team>;

  constructor(
    private teamService: TeamService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(res => {
      console.log(res);
      this.teams = res;
    });
  }

  async remove(item) {
    try {
      await this.teamService.removeTeam(item.id);
      this.utilsService.showToast('Time excluído');
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }

  }

}
