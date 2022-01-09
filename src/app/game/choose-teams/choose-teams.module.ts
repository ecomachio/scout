import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ChooseTeamsPage } from "./choose-teams.page";

const routes: Routes = [
  {
    path: "",
    component: ChooseTeamsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ChooseTeamsPage],
})
export class ChooseTeamsPageModule {}
