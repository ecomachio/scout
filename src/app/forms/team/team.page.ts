import { Component, OnInit } from "@angular/core";
import { Team } from "src/app/entity/team";
import {
  PickerController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { TeamService } from "src/app/services/team.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "src/app/services/utils.service";
import { CompetitionService } from "src/app/services/competition.service";
import { Competition } from "src/app/entity/competition";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-team",
  templateUrl: "./team.page.html",
  styleUrls: ["./team.page.scss"],
})
export class TeamPage implements OnInit {
  form: FormGroup;

  team: Team;
  competition: Competition;
  competitionId: string;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      city: [null, Validators.required],
      isMainTeam: [null],
    });

    this.team = new Team();
    const teamId = this.route.snapshot.params.id;
    if (teamId) {
      this.loadTeam(teamId);
    }
  }

  async loadTeam(teamId) {
    const loading = await this.loadingController.create({
      message: "Loading Team..",
    });
    await loading.present();

    this.teamService.getTeam(teamId).subscribe((res) => {
      loading.dismiss();
      console.log(res);
      this.team = res.data() as Team;
      this.team.id = teamId;
    });
  }

  async removeTeam() {
    if (this.team.id) {
      await this.teamService.removeTeam(this.team.id);
    }
    this.utilsService.showToast("Time excluído");
    this.router.navigateByUrl("/teames");
  }

  async done() {
    if (this.form.valid) {
      const loading = await this.loadingController.create({
        message: "Salvando..",
      });
      await loading.present();

      try {
        if (this.team.id) {
          await this.teamService.updateTeam(this.team, this.team.id);
        } else {
          await this.teamService.addTeam(this.team);
        }
        loading.dismiss();
        this.utilsService.showToast("Pronto");
        this.router.navigateByUrl(`/teams`);
      } catch (error) {
        console.error(error);
        this.utilsService.showToast("Erro ao salvar");
        loading.dismiss();
      }
    } else {
      this.utilsService.showToast("Verifique os campos informados");
    }
  }
}
