import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/entity/player';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { PositionEnum } from 'src/app/enum/Position.enum';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  player: Player;

  pickerOptions: PickerOptions;

  constructor(private pickerController: PickerController) { }



  ngOnInit() {
    this.player = new Player();
    console.log(PositionEnum);
    console.log(Object.keys(PositionEnum));
    console.log(Object.values(PositionEnum));
    this.pickerOptions = {
      buttons: [],
      columns: [
        {
          name: 'Posição',
          options: [
            {
              text: 'adb',
              value: 1
            },
            {
              text: 'adb',
              value: 1
            },
          ]
        }
      ]
    };
  }



}
