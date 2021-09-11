import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatchService } from "src/app/services/match.service";
import { GameService } from "src/app/services/game.service";
import { Match } from "src/app/entity/match";
import { ActionService } from "src/app/services/action.service";
import { QueryDocumentSnapshot } from "angularfire2/firestore";
import { Action } from "src/app/entity/action";
import { ActionEnum } from "src/app/enum/action.enum";
import { isUndefined } from "util";
import { ModalController } from "@ionic/angular";
import { PlayerOfTheMatchComponent } from "src/app/compenents/player-of-the-match/player-of-the-match.component";
import { IPlayerOfTheMach } from "src/app/compenents/player-of-the-match/player-of-the-match.component";

interface Stats {
  tackles?: number;
  finishes?: number;
  passes?: number;
  fouls?: number;
  goalkeeperSaves?: number;
  goal?: number;
  redCard?: number;
  yellowCard?: number;
  playerOfTheMatch?: string;
  notes?: string;
}

@Component({
  selector: "app-after-game",
  templateUrl: "./after-game.page.html",
  styleUrls: ["./after-game.page.scss"],
})
export class AfterGamePage implements OnInit {
  match: Match;
  actions: Array<Action> = [];
  modules: Array<{}>;
  stats: Stats = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchService: MatchService,
    private gameService: GameService,
    private actionService: ActionService,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;

    this.match = (
      await this.matchService.getMatchPromise(matchId)
    ).data() as Match;
    console.log(this.match);
    this.actions = await this.actionService
      .getActionsByMatch(matchId)
      .then((res: any) => {
        return res.docs.map((a: QueryDocumentSnapshot<Action>) => {
          const id = a.id;
          return { id, ...a.data() } as Action;
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
    const playerOfTheMatchAction = this.actions.filter(
      (n) => n.description === ActionEnum.PLAYEROFTHEMATCH
    )[0];
    let playerOfTheMatch = "";

    if (!isUndefined(playerOfTheMatchAction)) {
      playerOfTheMatch = playerOfTheMatchAction.player.name;
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
    } as Stats;
    console.log(this.actions);
  }

  done() {
    this.router.navigateByUrl(`/menu`);
  }

  async onClickPlayerOfTheMatch() {
    const modal = await this.modalController.create({
      component: PlayerOfTheMatchComponent,
      componentProps: {
        step: 1,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.stats.playerOfTheMatch = data.selectedPlayer.name;
  }

  async onClickNotes() {
    const modal = await this.modalController.create({
      component: PlayerOfTheMatchComponent,
      componentProps: {
        step: 2,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.match.notes = data.notes;
  }

  async onClickPassCount() {
    const modal = await this.modalController.create({
      component: PlayerOfTheMatchComponent,
      componentProps: {
        step: 3,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.match.passCount = data.passCount;
  }
}
