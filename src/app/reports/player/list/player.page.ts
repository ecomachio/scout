import { Component, OnInit } from "@angular/core";
import { PlayerService } from "src/app/services/player.service";
import { Player } from "src/app/entity/player";
import { UtilsService } from "src/app/services/utils.service";
import { CategoryService } from "src/app/services/category.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.page.html",
  styleUrls: ["./player.page.scss"],
})
export class PlayerPage implements OnInit {
  players: Array<Player>;
  searchTerm: string = "";
  
  constructor(
    private playerService: PlayerService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe((res) => {
      console.log(res);
      this.players = res;
    });
  }

  async remove(item) {
    try {
      await this.playerService.removePlayer(item.id);
      this.utilsService.showToast("Aluno excluído");
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }
  }
}
