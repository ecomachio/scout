import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/entity/player';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { PositionEnum } from 'src/app/enum/Position.enum';
import { PreferredFootEnum } from 'src/app/enum/preferredFoot.enum';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  player: Player;

  constructor(
    private pickerController: PickerController,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.player = new Player();
  }

  done() {
    console.log(this.player);
    this.playerService.addPlayer(this.player);
  }

  async showPreferredFootPicker() {
    const pickerOptions: PickerOptions = {
      buttons: [{ text: 'Pronto' }],
      columns: [
        {
          name: 'PreferredFoot',
          options: Object.keys(PreferredFootEnum).map(o => ({ value: o, text: PreferredFootEnum[o] }))
        }
      ]
    };

    const picker = await this.pickerController.create(pickerOptions);
    picker.present();

    picker.onDidDismiss().then(async () => {
      const col = await picker.getColumn('PreferredFoot');
      this.player.preferredFoot = PreferredFootEnum[col.options[col.selectedIndex].value];
    });
  }

  async showPositionPicker() {

    const pickerOptions: PickerOptions = {
      buttons: [{ text: 'Pronto' }],
      columns: [
        {
          name: 'Position',
          options: Object.keys(PositionEnum).map(o => ({ value: o, text: PositionEnum[o] }))
        }
      ]
    };

    const picker = await this.pickerController.create(pickerOptions);
    picker.present();

    picker.onDidDismiss().then(async () => {
      const col = await picker.getColumn('Position');
      this.player.position = PositionEnum[col.options[col.selectedIndex].value];
    });
  }



}
