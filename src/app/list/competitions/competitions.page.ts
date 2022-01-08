import { Component, OnInit } from "@angular/core";
import { CompetitionService } from "src/app/services/competition.service";
import { Competition } from "src/app/entity/competition";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-competitions",
  templateUrl: "./competitions.page.html",
  styleUrls: ["./competitions.page.scss"],
})
export class CompetitionsPage implements OnInit {
  competitions: Array<Competition>;

  constructor(
    private competitionsService: CompetitionService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.competitionsService.getCompetitions().subscribe((res) => {
      console.log(res);
      this.competitions = res;
    });
  }

  async remove(item) {
    try {
      await this.competitionsService.removeCompetition(item.id);
      this.utilsService.showToast("Competição excluída");
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }
  }
}
