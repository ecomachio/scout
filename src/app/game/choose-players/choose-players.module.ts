import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ChoosePlayersPage } from "./choose-players.page";

const routes: Routes = [
  {
    path: "",
    component: ChoosePlayersPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ChoosePlayersPage],
})
export class ChoosePlayersPageModule {}
