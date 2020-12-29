import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/entity/team';
import { UtilsService } from 'src/app/services/utils.service';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/entity/match';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {

  teams: Array<Team>;

  constructor(
    private teamService: TeamService,
    private matchService: MatchService,
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
      await this.deleteTeamMatches(item.id);
      this.utilsService.showToast('Time excluído');
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }

  }

  async deleteTeamMatches(id) {
    const docm = await this.matchService.getAllMatchs();
    const matches = docm.docs.map((m: QueryDocumentSnapshot<Match>) => {
      const mId = m.id;
      return { id: mId, ...m.data() } as Match;
    });
    const teamMatches = matches.filter((m: Match) => ((m.awayTeam.id === id) || (m.homeTeam.id === id)));
    const matchIdsToRmovePromises = teamMatches.map((m: Match) => this.matchService.removeMatch(m.id));
    Promise.all(matchIdsToRmovePromises).then(console.log);

  }

}
