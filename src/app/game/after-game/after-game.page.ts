import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { GameService } from 'src/app/services/game.service';
import { Match } from 'src/app/entity/match';
import { ActionService } from 'src/app/services/action.service';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Action } from 'src/app/entity/action';
import { ActionEnum } from 'src/app/enum/action.enum';

@Component({
  selector: 'app-after-game',
  templateUrl: './after-game.page.html',
  styleUrls: ['./after-game.page.scss'],
})
export class AfterGamePage implements OnInit {

  match: Match;
  actions: Array<Action> = [];
  modules: Array<{}>;
  stats = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchService: MatchService,
    private gameService: GameService,
    private actionService: ActionService,
  ) { }

  async ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;
   
    this.match =  (await this.matchService.getMatchPromise(matchId)).data() as Match; 
    console.log(this.match);
    this.actions = await this.actionService.getActionsByMatch(matchId).then((res: any) => {      
      return res.docs.map((a: QueryDocumentSnapshot<Action>) => {
        const id = a.id;
        return { id, ...a.data() } as Action;
      });
    });

    this.modules = Object.keys(ActionEnum).map(e => ({description: ActionEnum[e], name: e}));

    const tackles = this.actions.filter(n => n.description == ActionEnum.TACKLE).length; 
    const finishes = this.actions.filter(n => n.description == ActionEnum.FINISH).length; 
    const passes = this.actions.filter(n => n.description == ActionEnum.PASS).length; 
    const fouls = this.actions.filter(n => n.description == ActionEnum.FOUL).length; 
    const goalkeeperSaves = this.actions.filter(n => n.description == ActionEnum.GOALKEEPERSAVE).length

    this.stats = {
      tackles,
      finishes,
      passes,
      fouls,
      goalkeeperSaves
    };
    console.log(this.actions);
  }

}
