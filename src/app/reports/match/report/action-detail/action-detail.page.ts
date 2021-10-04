import { Component, OnInit } from "@angular/core";
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Action } from "src/app/entity/action";
import { Match } from "src/app/entity/match";
import { Player } from "src/app/entity/player";
import { ActionEnum } from "src/app/enum/action.enum";
import { ActionService } from "src/app/services/action.service";
import { MatchService } from "src/app/services/match.service";
import { PlayerService } from "src/app/services/player.service";

interface FrequencyPlayer extends Player {
  frequency?: number;
}

@Component({
  selector: "app-action-detail",
  templateUrl: "./action-detail.page.html",
  styleUrls: ["../match.page.scss", "../../../reports.page.scss"],
})
export class ActionDetailPage implements OnInit {
  match: Match = new Match();
  actions: Array<Action> = [];
  players: Array<FrequencyPlayer>;
  title: string;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private actionService: ActionService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    const actionName = this.route.snapshot.params.actionName.toUpperCase();
    this.match = (await this.matchService.getMatchPromise(id)).data() as Match;

    if (actionName == "GOALKEEPERSAVE") {
      this.title = "Defesas do Goleiro";
    } else this.title = ActionEnum[actionName];

    this.actions = await this.actionService
      .getActionsByMatch(id)
      .then((res: any) => {
        return res.docs.map((a: QueryDocumentSnapshot<Action>) => {
          const snapId = a.id;
          return { id: snapId, ...a.data() } as Action;
        });
      });

    this.actions = this.actions.filter(
      (a) => a.description === ActionEnum[actionName]
    );

    this.players = this.actions.map((a) => a.player).filter(Boolean);

    const frequency = this.players.reduce((acc, curr) => {
      console.log(acc, curr);
      if (acc[curr.id]) {
        acc[curr.id]++;
      } else {
        acc[curr.id] = 1;
      }
      return acc;
    }, {});

    this.players = this.players
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      .sort((a, b) => frequency[b.id] - frequency[a.id]);

    this.players.forEach((p) => (p.frequency = frequency[p.id]));
  }
}
