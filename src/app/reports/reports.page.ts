import { Component, OnInit } from '@angular/core';
import { ActionService } from '../services/action.service';
import { ActionEnum } from '../enum/action.enum';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Action } from '../entity/action';
import { Player } from '../entity/player';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  topScorer: TopScorer = new TopScorer();

  constructor(
    private actionService: ActionService,
  ) { }

  ngOnInit() {
    this.actionService.getActionsByActionDescription(ActionEnum.GOAL).then(res => {
      const allGoalsActions: Array<Action> = res.docs.map((m: QueryDocumentSnapshot<Action>) => {
        const id = m.id;
        return { id, ...m.data() } as Action;
      });
      console.log(allGoalsActions);
      this.topScorer = this.getTopScorer(allGoalsActions);
    });
  }

  getTopScorer(allGoalsActions: Array<Action>): TopScorer {
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
    return result;
  }
}

class TopScorer extends Player {
  goalsScored: number;
}

