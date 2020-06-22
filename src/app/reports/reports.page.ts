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
import { isUndefined } from 'util';
import { ChartOptions, ChartType, ChartDataSets, ChartColor } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();
  topScorers: Array<TopScorer> = [];
  topScorer: TopScorer;
  competitions: Array<Competition>;
  players: Array<Player>;
  matchs: Array<Match>;
  matchsGoals: Array<MatchGoals>;
  categories: Array<Category>;
  mainTeam: Team;

  allGoalsByMainTeam: Array<Action>;
  allGoalsConceded: Array<Action>;

  goalsScoredConcededRatio: number;

  goalsScoredConcededRatioChartLabels: Label[] = [];
  goalsScoredConcededRatioChartData: ChartDataSets[] = [{ data: [], label: "Razão" }];
  goalsScoredConcededRatioChartType: ChartType = 'line';
  goalsScoredConcededRatioChartColors: Color[] = [];
  goalsScoredConcededRatioChartOptions: ChartOptions = {
    responsive: true,
  }

  topScorersChartLabels: Label[] = [];
  topScorersChartData: ChartDataSets[] = [{ data: [], label: "asd" }];
  topScorersChartType: ChartType = 'pie';
  topScorersChartLegend = false;
  topScorersChartOptions: ChartOptions = {
    responsive: true,
  }


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
    this.getTopScorers(allGoalsActions.filter(goals => goals.decision));
    this.getAllGoalsByMainTeam(allGoalsActions);
    this.getAllGoalsConceded(allGoalsActions);
    this.getCompetitions();
    this.getPlayers();
    this.getCategories();
    this.getMainTeam();
    this.getMatchs(allGoalsActions);
  }

  getGoalsScoredConcededRatioByMatch(allGoalsActions: Array<Action>) {

    this.matchsGoals = this.matchs.map((m: Match) => {

      const amg = allGoalsActions.filter(a => (a.match.id == m.id));
      const goalsScored = amg.filter(a => a.decision).length;
      const goalsConceded = amg.filter(a => !a.decision).length;
      const ratio = goalsScored / goalsConceded;

      return { ...m, goalsScored, goalsConceded, ratio } as MatchGoals;
    });

    this.setupGoalsScoredConcededRatioChart();
  }

  setupTopScorersChart() {
    this.topScorersChartData[0].data = [];
    this.topScorersChartLabels = [];

    for (const top of this.topScorers.slice(0, 10)) {
      this.topScorersChartData[0].data.push(top.goalsScored);
      this.topScorersChartLabels.push(top.name);
    }
  }

  setupGoalsScoredConcededRatioChart() {
    this.goalsScoredConcededRatioChartData.push({ data: [], label: "Gols marcados" })
    this.goalsScoredConcededRatioChartData.push({ data: [], label: "Gols contra" })

    this.goalsScoredConcededRatioChartData[0].data = [];
    this.goalsScoredConcededRatioChartData[1].data = [];
    this.goalsScoredConcededRatioChartData[2].data = [];

    this.goalsScoredConcededRatioChartColors.push({
      backgroundColor: 'rgba(0,0,0,0.0)',
      borderColor: '#3880ff',
    })
    this.goalsScoredConcededRatioChartColors.push(
      {
        backgroundColor: 'rgba(0,0,0,0.0)',
        borderColor: '#2dd36f',
      })
    this.goalsScoredConcededRatioChartColors.push(
      {
        backgroundColor: 'rgba(0,0,0,0.0)',
        borderColor: '#eb445a',
      })

    for (const mg of this.matchsGoals) {
      this.goalsScoredConcededRatioChartData[0].data.push(mg.ratio);
      this.goalsScoredConcededRatioChartData[1].data.push(mg.goalsScored);
      this.goalsScoredConcededRatioChartData[2].data.push(mg.goalsConceded);
      this.goalsScoredConcededRatioChartLabels.push(mg.description);
    }
    console.log(this.goalsScoredConcededRatio);

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

  async getMatchs(allGoalsActions: Array<Action>) {
    const docm = await this.matchService.getAllClosedMatchs();
    this.matchs = docm.docs.map((m: QueryDocumentSnapshot<Match>) => {
      const id = m.id;
      return { id, ...m.data() } as Match;
    });

    this.getGoalsScoredConcededRatioByMatch(allGoalsActions);

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

  getTopScorers(allGoalsActions: Array<Action>): void {
    let prev;

    allGoalsActions.sort((a, b) => {
      if (a.player.id > b.player.id) return 1;
      if (a.player.id < b.player.id) return -1;
      return 0;
    })

    console.log(allGoalsActions)
    for (var i = 0; i < allGoalsActions.length; i++) {
      if (isUndefined(prev) || (allGoalsActions[i].player.id !== prev.player.id)) {
        this.topScorers.push({ ...allGoalsActions[i].player, goalsScored: 1 });
      } else {
        this.topScorers[this.topScorers.length - 1].goalsScored++
      }
      prev = allGoalsActions[i];
    }

    this.topScorers.sort((t1, t2) => t2.goalsScored - t1.goalsScored);
    this.topScorer = this.topScorers[0];

    this.setupTopScorersChart();
  }
}

class MatchGoals extends Match {
  goalsScored: number;
  goalsConceded: number;
  ratio: number;
}

class TopScorer extends Player {
  goalsScored: number;
}


