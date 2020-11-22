import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/entity/player';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PickerController, NavController, LoadingController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/entity/category';
import { MatchService } from 'src/app/services/match.service';
import { ActionService } from 'src/app/services/action.service';
import { QueryDocumentSnapshot, QuerySnapshot } from 'angularfire2/firestore';
import { Match } from 'src/app/entity/match';
import { Action } from 'src/app/entity/action';
import { ActionEnum } from 'src/app/enum/action.enum';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  players: Array<Player>;
  categories: Array<Category>;
  player: Player;
  actions: Array<Action> = [];

  totalGoalsScored: number;
  totalMatchesPlayed: number;

  constructor(
    private pickerController: PickerController,
    private playerService: PlayerService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router,
    private matchService: MatchService,
    private actionService: ActionService,
  ) { }

  async ngOnInit() {
    this.player = new Player();
    this.categoryService.getCategories().subscribe(cat => this.categories = cat);
    const playerId = this.route.snapshot.params.id;
    if (playerId) {
      await this.loadPlayer(playerId);
    }
  }

  async getPlayerActions() {
    const matches = await this.getPlayerMatches();
    let actionPromises = [];

    actionPromises = matches.map(m => {
      return this.actionService.getActionsByMatch(m.id);
    });

    return await Promise.all(actionPromises).then((res: Array<QuerySnapshot<any>>) => {
      return res.map((querySnapshot: QuerySnapshot<any>) => querySnapshot.docs)
        .reduce((pre, cur) => pre.concat(cur), [])
        .map((doc: QueryDocumentSnapshot<Action>) => {
          const id = doc.id;
          return { id, ...doc.data() } as Action;
        })
        .filter(action =>
          ((!isNullOrUndefined(action.player)) && (this.player.id === action.player.id)));
    });
  }

  async getPlayerMatches() {
    const docm = await this.matchService.getAllClosedMatchs();

    const matches = docm.docs.map((m: QueryDocumentSnapshot<Match>) => {
      const id = m.id;
      return { id, ...m.data() } as Match;
    }).filter(m => ((m.category.id === this.player.category.id) && (m.isFinished)));

    return matches;
  }

  async getTotalGoalsScored() {
    const tgs = this.actions.filter(action => action.description === ActionEnum.GOAL).length;
    return tgs;
  }

  async getTotalMatchesPlayed() {
    const matches = await this.getPlayerMatches();

    return matches.length;
  }

  async loadPlayer(playerId) {
    const loading = await this.loadingController.create({
      message: 'Loading Player..'
    });
    await loading.present();

    this.playerService.getPlayer(playerId).subscribe(async res => {

      loading.dismiss();

      this.player = res;
      this.player.id = playerId;

      this.actions = await this.getPlayerActions();

      this.totalGoalsScored = await this.getTotalGoalsScored();
      console.log(this.totalGoalsScored);

      this.totalMatchesPlayed = await this.getTotalMatchesPlayed();
    });
  }

}
