import { Component, OnInit, Input } from '@angular/core';
import { ActionEnum } from 'src/app/enum/action.enum';
import { Match } from 'src/app/entity/match';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-other-modules',
  templateUrl: './other-modules.component.html',
  styleUrls: ['./other-modules.component.scss'],
})
export class OtherModulesComponent implements OnInit {

  @Input() match: Match;

  get actionEnum() { return ActionEnum; }

  constructor(
    private modalController: ModalController,
    private router: Router,
  ) { }

  ngOnInit() { }

  choosePlayers(action) {
    this.router.navigate([`choose-players/${this.match.category.id}`], { queryParams: { action, step: 1 } });
    this.modalController.dismiss();
  }

}
