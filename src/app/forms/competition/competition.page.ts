import { Component, OnInit } from "@angular/core";
import { Competition } from "src/app/entity/competition";
import { Match } from "src/app/entity/match";
import {
  PickerController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { MatchService } from "src/app/services/match.service";
import { CompetitionService } from "src/app/services/competition.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "src/app/services/utils.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-competition",
  templateUrl: "./competition.page.html",
  styleUrls: ["./competition.page.scss"],
})
export class CompetitionPage implements OnInit {
  form: FormGroup;
  competition: Competition;

  constructor(
    private pickerController: PickerController,
    private matchService: MatchService,
    private competitionService: CompetitionService,
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
      description: [null, Validators.required],
      city: [null, Validators.required],
      start: [null, Validators.required],
      end: [null, Validators.required],
    });

    this.competition = new Competition();
    const competitionId = this.route.snapshot.params.id;
    if (competitionId) {
      this.loadCompetition(competitionId);
    }
  }

  async loadCompetition(competitionId) {
    const loading = await this.loadingController.create({
      message: "Loading Competition..",
    });
    await loading.present();
    this.competitionService.getCompetition(competitionId).subscribe((res) => {
      loading.dismiss();
      console.log(res);
      this.competition = res.data() as Competition;
      this.competition.id = res.id;
    });
  }

  async removeCompetition() {
    if (this.competition.id) {
      await this.competitionService.removeCompetition(this.competition.id);
    }
    this.utilsService.showToast("Aluno excluído");
    this.router.navigateByUrl("/matches");
  }

  async done() {
    if (!this.form.valid) {
      this.utilsService.showToast("Verifique os campos informados");
      return;
    }
    this.save();
    this.router.navigateByUrl("/competitions");
  }

  async save() {
    if (this.competition.id) {
      return await this.competitionService.updateCompetition(
        this.competition,
        this.competition.id
      );
    } else {
      return await this.competitionService.addCompetition(this.competition);
    }
    this.utilsService.showToast("Pronto");
  }

  async navToMatchs() {
    const res = (await this.save()) as any;

    if (!this.competition.id) {
      this.competition.id = res.id;
    }

    console.log(this.competition);
    this.router.navigateByUrl(`/matches/${this.competition.id}`);
  }
}
