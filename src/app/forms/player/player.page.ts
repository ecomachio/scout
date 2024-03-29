import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/entity/player";
import {
  PickerController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { PickerOptions, PickerColumnOption } from "@ionic/core";
import { PositionEnum } from "src/app/enum/position.enum";
import { PreferredFootEnum } from "src/app/enum/preferredFoot.enum";
import { PlayerService } from "src/app/services/player.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "src/app/services/utils.service";
import { CategoryService } from "src/app/services/category.service";
import { Category } from "src/app/entity/category";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-player",
  templateUrl: "./player.page.html",
  styleUrls: ["./player.page.scss"],
})
export class PlayerPage implements OnInit {
  form: FormGroup;

  player: Player;
  categories: Array<Category>;
  compareWith;

  constructor(
    private pickerController: PickerController,
    private playerService: PlayerService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      address: [null, Validators.required],
      document: [null],
      birthdate: [null, Validators.required],
      responsible: [null, Validators.required],
      phone: [null, Validators.required],
      homePhone: [null],
      category: [null, Validators.required],
      shirtNumber: [null, Validators.required],
      position: [null, Validators.required],
      preferredFoot: [null, Validators.required],
    });

    this.player = new Player();
    this.categoryService
      .getCategories()
      .subscribe((cat) => (this.categories = cat));
    const playerId = this.route.snapshot.params.id;
    if (playerId) {
      this.loadPlayer(playerId);
    }
    this.compareWith = this.compareWithFn;
  }

  async loadPlayer(playerId) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.playerService.getPlayer(playerId).subscribe((res) => {
      loading.dismiss();
      console.log(res);
      this.player = res;
      this.player.id = playerId;
    });
  }

  async done() {
    if (!this.form.valid) {
      this.utilsService.showToast("Verifique os campos informados");
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    try {
      if (this.player.id) {
        await this.playerService.updatePlayer(this.player, this.player.id);
      } else {
        await this.playerService.addPlayer(this.player);
      }
      loading.dismiss();
      this.utilsService.showToast("Pronto");
      this.router.navigateByUrl("/players");
    } catch (error) {
      console.error(error);
      this.utilsService.showToast("Erro ao salvar");
      loading.dismiss();
    }
  }

  async showPreferredFootPicker() {
    const pickerOptions: PickerOptions = {
      buttons: [{ text: "Pronto" }],
      columns: [
        {
          name: "PreferredFoot",
          options: Object.keys(PreferredFootEnum).map((o) => ({
            value: o,
            text: PreferredFootEnum[o],
          })),
        },
      ],
    };

    const picker = await this.pickerController.create(pickerOptions);
    picker.present();

    picker.onDidDismiss().then(async () => {
      const col = await picker.getColumn("PreferredFoot");
      this.player.preferredFoot =
        PreferredFootEnum[col.options[col.selectedIndex].value];
    });
  }

  async showPositionPicker() {
    const pickerOptions: PickerOptions = {
      buttons: [{ text: "Pronto" }],
      columns: [
        {
          name: "Position",
          options: Object.keys(PositionEnum).map((o) => ({
            value: o,
            text: PositionEnum[o],
          })),
        },
      ],
    };

    const picker = await this.pickerController.create(pickerOptions);
    picker.present();

    picker.onDidDismiss().then(async () => {
      const col = await picker.getColumn("Position");
      this.player.position = PositionEnum[col.options[col.selectedIndex].value];
    });
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };
}
