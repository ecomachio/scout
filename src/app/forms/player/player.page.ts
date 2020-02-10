import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/entity/player';
import { PickerController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { PositionEnum } from 'src/app/enum/Position.enum';
import { PreferredFootEnum } from 'src/app/enum/preferredFoot.enum';
import { PlayerService } from 'src/app/services/player.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  player: Player;

  constructor(
    private pickerController: PickerController,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.player = new Player();
    const playerId = this.route.snapshot.params.id;
    if (playerId) {
      this.loadPlayer(playerId);
    }
  }

  async loadPlayer(playerId) {
    const loading = await this.loadingController.create({
      message: 'Loading Player..'
    });
    await loading.present();

    this.playerService.getPlayer(playerId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.player = res;
      this.player.id = playerId;
    });
  }

  async done() {
    if (this.player.id) {
      await this.playerService.updatePlayer(this.player, this.player.id);
    } else {
      await this.playerService.addPlayer(this.player);
    }
    this.showToast('Pronto');
    this.router.navigateByUrl('/players');
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

  showToast(msg) {
    this.toastController.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
