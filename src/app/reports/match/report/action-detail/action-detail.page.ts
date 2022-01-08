import { Component, OnInit } from "@angular/core";
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Action } from "src/app/entity/action";
import { Match } from "src/app/entity/match";
import { Player } from "src/app/entity/player";
import { ActionEnum } from "src/app/enum/action.enum";
import { ActionService } from "src/app/services/action.service";
import { MatchService } from "src/app/services/match.service";

interface FrequencyPlayer extends Player {
  frequency?: number;
  correctFrequency?: number;
  incorrectFrequency?: number;
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
  listHeader: string[];

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private actionService: ActionService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    const actionName = this.route.snapshot.params.actionName.toUpperCase();
    this.match = (await this.matchService.getMatchPromise(id)).data() as Match;

    if (ActionEnum[actionName] == ActionEnum.FINISH) {
      this.listHeader = ["Jogador", "Acertos", "Erros"];
    } else {
      this.listHeader = ["Jogador", ActionEnum[actionName]];
    }

    if (actionName == "GOALKEEPERSAVE") {
      this.title = "Defesas do Goleiro";
      this.listHeader = ["Jogador", "Defesas"];
    } else {
      this.title = ActionEnum[actionName];
    }

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

    console.log(`action`, this.actions);

    this.players = this.actions
      .filter((a) => a.player)
      .reduce((acc, curr) => {
        const player = curr.player as FrequencyPlayer;
        const action = curr;

        player.correctFrequency = player.correctFrequency || 0;
        player.incorrectFrequency = player.incorrectFrequency || 0;

        if (acc.find((p) => p.id === player.id)) {
          const index = acc.findIndex((p) => p.id === player.id);
          acc[index].frequency++;
          action.decision
            ? acc[index].correctFrequency++
            : acc[index].incorrectFrequency++;
        } else {
          if (!player.name) {
            player.name = "[Adversario]";
          }

          player.frequency = 1;
          action.decision
            ? player.correctFrequency++
            : player.incorrectFrequency++;

          acc.push(player);
        }

        return acc;
      }, []);
  }
}
