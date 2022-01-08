import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CompetitionService } from "src/app/services/competition.service";
import { MatchService } from "src/app/services/match.service";
import { LoadingController } from "@ionic/angular";
import { Match } from "src/app/entity/match";
import { QueryDocumentSnapshot } from "angularfire2/firestore";

import { ActionEnum } from "src/app/enum/action.enum";
import { ActionService } from "src/app/services/action.service";
import { Action } from "src/app/entity/action";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-match",
  templateUrl: "./match.page.html",
  styleUrls: ["./match.page.scss", "../../reports.page.scss"],
})
export class MatchPage implements OnInit {
  match: Match = new Match();
  actions: Array<Action> = [];
  modules: Array<{}>;
  stats = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private matchService: MatchService,
    private actionService: ActionService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.match = (await this.matchService.getMatchPromise(id)).data() as Match;

    this.actions = await this.actionService
      .getActionsByMatch(id)
      .then((res: any) => {
        return res.docs.map((a: QueryDocumentSnapshot<Action>) => {
          const snapId = a.id;
          return { id: snapId, ...a.data() } as Action;
        });
      });

    this.modules = Object.keys(ActionEnum).map((e) => ({
      description: ActionEnum[e],
      name: e,
    }));

    const tackles = this.actions.filter(
      (n) => n.description === ActionEnum.TACKLE
    ).length;
    const finishes = this.actions.filter(
      (n) => n.description === ActionEnum.FINISH
    ).length;
    const passes = this.actions.filter(
      (n) => n.description === ActionEnum.PASS
    ).length;
    const fouls = this.actions.filter(
      (n) => n.description === ActionEnum.FOUL
    ).length;
    const goalkeeperSaves = this.actions.filter(
      (n) => n.description === ActionEnum.GOALKEEPERSAVE
    ).length;
    const goal = this.actions.filter(
      (n) => n.description === ActionEnum.GOAL
    ).length;
    const redCard = this.actions.filter(
      (n) => n.description === ActionEnum.REDCARD
    ).length;
    const yellowCard = this.actions.filter(
      (n) => n.description === ActionEnum.YELLOWCARD
    ).length;
    let playerOfTheMatch = "";
    if (!isNullOrUndefined(this.match.playerOfTheMatch)) {
      playerOfTheMatch = this.match.playerOfTheMatch.name;
    }

    this.stats = {
      tackles,
      finishes,
      passes,
      fouls,
      goalkeeperSaves,
      goal,
      redCard,
      yellowCard,
      playerOfTheMatch,
    };
  }
}
