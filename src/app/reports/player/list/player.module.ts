import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { IonicModule } from "@ionic/angular";

import { PlayerPage } from "./player.page";

const routes: Routes = [
  {
    path: "",
    component: PlayerPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PlayerPage],
})
export class PlayerPageModule {}
