import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BeforeGamePage } from './before-game.page';
import { ListComponent } from 'src/app/compenents/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: BeforeGamePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BeforeGamePage, ListComponent]
})
export class BeforeGamePageModule {}
