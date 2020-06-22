import { Component, OnInit } from '@angular/core';
import { ActionService } from '../services/action.service';
import { ActionEnum } from '../enum/action.enum';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Action } from '../entity/action';
import { Player } from '../entity/player';
import { async } from '@angular/core/testing';
import { CompetitionService } from '../services/competition.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Competition } from '../entity/competition';
import { PlayerService } from '../services/player.service';
import { Category } from '../entity/category';
import { CategoryService } from '../services/category.service';
import { Team } from '../entity/team';
import { TeamService } from '../services/team.service';
import { MatchService } from '../services/match.service';
import { Match } from '../entity/match';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();
  topScorer: TopScorer;
  competitions: Array<Competition>;
  players: Array<Player>;
  matchs: Array<Match>;
  categories: Array<Category>;
  mainTeam: Team;

  allGoalsByMainTeam: Array<Action>;
  allGoalsConceded: Array<Action>;
  ;

  constructor(
    private actionService: ActionService,
    private competitionsService: CompetitionService,
    private playerService: PlayerService,
    private teamService: TeamService,
    private matchService: MatchService,
    private categoryService: CategoryService,
  ) { }

  async ngOnInit() {
    const allGoalsActions: Array<Action> = await this.getActions(ActionEnum.GOAL);
    this.getTopScorer(allGoalsActions.filter(goals => goals.decision));
    this.getAllGoalsByMainTeam(allGoalsActions);
    this.getAllGoalsConceded(allGoalsActions);
    this.getCompetitions();
    this.getPlayers();
    this.getCategories();
    this.getMainTeam();
    this.getMatchs();
  }

  getAllGoalsConceded(allGoalsActions: Action[]) {
    this.allGoalsConceded = allGoalsActions.filter(goals => !goals.decision);
  }

  getAllGoalsByMainTeam(allGoalsActions: Action[]) {
    this.allGoalsByMainTeam = allGoalsActions.filter(goals => goals.decision);
  }

  async getActions(action: string) {
    const actions = (await this.actionService.getActionsByActionDescription(action)).docs.map((m: QueryDocumentSnapshot<Action>) => {
      const id = m.id;
      return { id, ...m.data() } as Action;
    })
    return actions;
  }

  getCompetitions() {
    this.competitionsService.getCompetitions().pipe(takeUntil(this.unsubscribe$)).subscribe(c => this.competitions = c);
  }

  getPlayers() {
    this.playerService.getPlayers().pipe(takeUntil(this.unsubscribe$)).subscribe(p => this.players = p);
  }

  async getMatchs() {
    const docm = await this.matchService.getAllMatchs();
    this.matchs = docm.docs.map((m: QueryDocumentSnapshot<Match>) => {
      const id = m.id;
      return { id, ...m.data() } as Match;
    })
  }

  async getMainTeam() {
    const docmt = await this.teamService.getMainTeam();
    this.mainTeam = docmt.docs.map((m: QueryDocumentSnapshot<Team>) => {
      const id = m.id;
      return { id, ...m.data() } as Team;
    })[0];
  }

  getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.unsubscribe$)).subscribe(c => this.categories = c);
  }

  getTopScorer(allGoalsActions: Array<Action>): void {
    let mf = 1;
    let m = 0;
    let item;
    let result: TopScorer;

    for (let i = 0; i < allGoalsActions.length; i++) {
      for (let j = i; j < allGoalsActions.length; j++) {
        if (allGoalsActions[i].player.id == allGoalsActions[j].player.id)
          m++;
        if (mf < m) {
          mf = m;
          item = allGoalsActions[i];
        }
      }
      m = 0;
    }
    console.log(item.player.name, item + " ( " + mf + " times ) ");
    result = item.player;
    result.goalsScored = mf;
    this.topScorer = result;
  }
}

class TopScorer extends Player {
  goalsScored: number;
}


