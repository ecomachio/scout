import { Component, OnInit } from "@angular/core";
import { ActionService } from "../services/action.service";
import { ActionEnum } from "../enum/action.enum";
import { QueryDocumentSnapshot } from "angularfire2/firestore";
import { Action } from "../entity/action";
import { Player } from "../entity/player";
import { async } from "@angular/core/testing";
import { CompetitionService } from "../services/competition.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Competition } from "../entity/competition";
import { PlayerService } from "../services/player.service";
import { Category } from "../entity/category";
import { CategoryService } from "../services/category.service";
import { Team } from "../entity/team";
import { TeamService } from "../services/team.service";
import { MatchService } from "../services/match.service";
import { Match } from "../entity/match";
import { isUndefined } from "util";
import { ChartOptions, ChartType, ChartDataSets, ChartColor } from "chart.js";
import { Label, Color } from "ng2-charts";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.page.html",
  styleUrls: ["./reports.page.scss"],
})
export class ReportsPage implements OnInit {
  unsubscribe$: Subject<void> = new Subject<void>();
  topScorers: Array<TopScorer> = [];
  topScorer: TopScorer;
  competitions: Array<Competition>;
  players: Array<Player>;
  matchs: Array<Match>;
  matchStats: Array<MatchStats>;
  matchShots: Array<MatchStats>;
  categories: Array<Category>;
  mainTeam: Team;
  topScoredMatchs: Array<MatchStats>;
  topConcededMatchs: Array<MatchStats>;

  allGoalsByMainTeam: Array<Action>;
  allGoalsConceded: Array<Action>;

  goalsScoredShotsRatio: number;

  goalsScoredShotsRatioChartLabels: Label[] = [];
  goalsScoredShotsRatioChartData: ChartDataSets[] = [
    { data: [], label: "Gols marcados" },
    { data: [], label: "Chutes a gol" },
  ];

  goalsScoredShotsRatioChartType: ChartType = "bar";
  goalsScoredShotsRatioChartColors: Color[] = [];
  goalsScoredShotsRatioChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };

  topScorersChartLabels: Label[] = [];
  topScorersChartData: ChartDataSets[] = [{ data: [], label: "Marcadores" }];
  topScorersChartType: ChartType = "pie";
  topScorersChartLegend = false;
  topScorersChartOptions: ChartOptions = {
    responsive: true,
  };

  topScoredMatchsChartLabels: Label[] = [];
  topScoredMatchsChartData: ChartDataSets[] = [
    { data: [], label: "Partidas com mais gols" },
  ];
  topScoredMatchsChartType: ChartType = "pie";
  topScoredMatchsChartLegend = false;
  topScoredMatchsChartOptions: ChartOptions = {
    responsive: true,
  };

  topConcededMatchsChartLabels: Label[] = [];
  topConcededMatchsChartData: ChartDataSets[] = [
    { data: [], label: "Partidas com mais gols sofridos" },
  ];
  topConcededMatchsChartType: ChartType = "pie";
  topConcededMatchsChartLegend = false;
  topConcededMatchsChartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(
    private actionService: ActionService,
    private competitionsService: CompetitionService,
    private playerService: PlayerService,
    private teamService: TeamService,
    private matchService: MatchService,
    private categoryService: CategoryService
  ) {}

  async ngOnInit() {
    const allGoalsActions: Array<Action> = await this.getActions(
      ActionEnum.GOAL
    );
    const allShots: Array<Action> = await this.getActions(ActionEnum.FINISH);
    this.getTopScorers(allGoalsActions.filter((goals) => goals.decision));
    this.getAllGoalsByMainTeam(allGoalsActions);
    this.getAllGoalsConceded(allGoalsActions);
    this.getCompetitions();
    this.getPlayers();
    this.getCategories();
    this.getMainTeam();
    this.getMatchs(allGoalsActions, allShots);
  }

  getGoalsScoredShotsRatioByMatch() {
    this.setupGoalsScoredShotsRatioChart();
  }

  private getMatchGoals(allGoalsActions: Action[]) {
    this.matchStats = this.matchs.map((m: Match) => {
      const amg = allGoalsActions.filter((a) => a.match.id === m.id);
      const goalsScored = amg.filter((a) => a.decision).length;
      const goalsConceded = amg.filter((a) => !a.decision).length;

      return { ...m, goalsScored, goalsConceded } as MatchStats;
    });
  }

  private getMatchShots(allShotsActions: Action[]) {
    this.matchStats = this.matchStats.map((m: Match) => {
      const amg = allShotsActions.filter((a) => a.match.id === m.id);
      const shotsOnTarget = amg.filter((a) => a.decision).length;
      const shotsOffTarget = amg.filter((a) => !a.decision).length;
      console.log({ ...m, shotsOnTarget, shotsOffTarget });

      return { ...m, shotsOnTarget, shotsOffTarget } as MatchStats;
    });
  }

  setupTopScorersChart() {
    this.topScorersChartData[0].data = [];
    this.topScorersChartLabels = [];

    for (const top of this.topScorers.slice(0, 10)) {
      this.topScorersChartData[0].data.push(top.goalsScored);
      this.topScorersChartLabels.push(top.name);
    }
  }

  setupGoalsScoredShotsRatioChart() {
    this.goalsScoredShotsRatioChartData[0].data = [];
    this.goalsScoredShotsRatioChartData[1].data = [];

    for (const mg of this.matchStats.slice(0, 15)) {
      console.log(mg.shotsOnTarget);

      this.goalsScoredShotsRatioChartData[0].data.push(mg.goalsScored);
      this.goalsScoredShotsRatioChartData[1].data.push(mg.shotsOnTarget);
      this.goalsScoredShotsRatioChartLabels.push(mg.description);
    }
  }

  getAllGoalsConceded(allGoalsActions: Action[]) {
    this.allGoalsConceded = allGoalsActions.filter((goals) => !goals.decision);
  }

  getAllGoalsByMainTeam(allGoalsActions: Action[]) {
    this.allGoalsByMainTeam = allGoalsActions.filter((goals) => goals.decision);
  }

  async getActions(action: string) {
    const actions = (
      await this.actionService.getActionsByActionDescription(action)
    ).docs.map((m: QueryDocumentSnapshot<Action>) => {
      const id = m.id;
      return { id, ...m.data() } as Action;
    });
    return actions;
  }

  getCompetitions() {
    this.competitionsService
      .getCompetitions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((c) => (this.competitions = c));
  }

  getPlayers() {
    this.playerService
      .getPlayers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((p) => (this.players = p));
  }

  async getMatchs(allGoalsActions: Array<Action>, allShots: Array<Action>) {
    const docm = await this.matchService.getAllClosedMatchs();
    this.matchs = docm.docs.map((m: QueryDocumentSnapshot<Match>) => {
      const id = m.id;
      return { id, ...m.data() } as Match;
    });

    this.getMatchGoals(allGoalsActions);
    this.getMatchShots(allShots);
    this.getGoalsScoredShotsRatioByMatch();
    this.getBestMatchs();
    this.getWorstMatchs();
  }

  getWorstMatchs() {
    this.matchStats.sort((a, b) => b.goalsConceded - a.goalsConceded);
    this.topConcededMatchs = this.matchStats.slice(0, 10);
    this.setupWorstMatchChart();
  }

  setupWorstMatchChart() {
    this.topConcededMatchsChartData[0].data = [];
    this.topConcededMatchsChartLabels = [];

    for (const bm of this.topConcededMatchs.slice(0, 10)) {
      this.topConcededMatchsChartData[0].data.push(bm.goalsConceded);
      this.topConcededMatchsChartLabels.push(bm.description);
    }
  }

  getBestMatchs() {
    this.matchStats.sort((a, b) => b.goalsScored - a.goalsScored);
    this.topScoredMatchs = this.matchStats.slice(0, 10);
    this.setupBestMatchChart();
  }

  setupBestMatchChart() {
    this.topScoredMatchsChartData[0].data = [];
    this.topScoredMatchsChartLabels = [];

    for (const bm of this.topScoredMatchs.slice(0, 10)) {
      this.topScoredMatchsChartData[0].data.push(bm.goalsScored);
      this.topScoredMatchsChartLabels.push(bm.description);
    }
  }

  async getMainTeam() {
    const docmt = await this.teamService.getMainTeam();
    this.mainTeam = docmt.docs.map((m: QueryDocumentSnapshot<Team>) => {
      const id = m.id;
      return { id, ...m.data() } as Team;
    })[0];
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((c) => (this.categories = c));
  }

  getTopScorers(allGoalsActions: Array<Action>): void {
    let prev;

    allGoalsActions.sort((a, b) => {
      if (a.player.id > b.player.id) {
        return 1;
      }
      if (a.player.id < b.player.id) {
        return -1;
      }
      return 0;
    });

    console.log(allGoalsActions);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < allGoalsActions.length; i++) {
      if (
        isUndefined(prev) ||
        allGoalsActions[i].player.id !== prev.player.id
      ) {
        this.topScorers.push({ ...allGoalsActions[i].player, goalsScored: 1 });
      } else {
        this.topScorers[this.topScorers.length - 1].goalsScored++;
      }
      prev = allGoalsActions[i];
    }

    this.topScorers.sort((t1, t2) => t2.goalsScored - t1.goalsScored);
    this.topScorers = this.topScorers.slice(0, 10);
    this.topScorer = this.topScorers[0];

    this.setupTopScorersChart();
  }
}

interface MatchStats extends Match {
  goalsScored: number;
  goalsConceded: number;
  shotsOffTarget: number;
  shotsOnTarget: number;
}

interface TopScorer extends Player {
  goalsScored: number;
}
