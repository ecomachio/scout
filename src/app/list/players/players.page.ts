import { Component, OnInit } from "@angular/core";
import { PlayerService } from "src/app/services/player.service";
import { Player } from "src/app/entity/player";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-players",
  templateUrl: "./players.page.html",
  styleUrls: ["./players.page.scss"],
})
export class PlayersPage implements OnInit {
  players: Array<Player>;

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
