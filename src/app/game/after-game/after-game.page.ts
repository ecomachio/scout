import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';
import { GameService } from 'src/app/services/game.service';
import { Match } from 'src/app/entity/match';
import { ActionService } from 'src/app/services/action.service';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Action } from 'src/app/entity/action';

@Component({
  selector: 'app-after-game',
  templateUrl: './after-game.page.html',
  styleUrls: ['./after-game.page.scss'],
})
export class AfterGamePage implements OnInit {

  match: Match;
  actions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchService: MatchService,
    private gameService: GameService,
    private actionService: ActionService,
  ) { }

  async ngOnInit() {
    const matchId = this.route.snapshot.params.matchId;
    console.log(matchId);
    this.actions = await this.actionService.getActionsByMatch(matchId).then((res: any) => {
      if (!res) {
        this.actions = [];
      }
      return res.docs.map((a: QueryDocumentSnapshot<Action>) => {
        const id = a.id;
        return { id, ...a.data() } as Action;
      });
    });
    console.log(this.actions);
  }

}
