import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'choose-players',
    loadChildren: './choose-players/choose-players.module#ChoosePlayersPageModule'
  },
  {
    path: 'statistics',
    loadChildren: './statistics/statistics.module#StatisticsPageModule'
  },
  {
    path: 'player',
    loadChildren: './forms/player/player.module#PlayerPageModule'
  },
  {
    path: 'player/:id',
    loadChildren: './forms/player/player.module#PlayerPageModule'
  },
  {
    path: 'players',
    loadChildren: './list/players/players.module#PlayersPageModule'
  },
  {
    path: 'category',
    loadChildren: './forms/category/category.module#CategoryPageModule'
  },
  {
    path: 'competition',
    loadChildren: './forms/competition/competition.module#CompetitionPageModule'
  },
  {
    path: 'competition/:id',
    loadChildren: './forms/competition/competition.module#CompetitionPageModule'
  },
  {
    path: 'competitions',
    loadChildren: './list/competitions/competitions.module#CompetitionsPageModule'
  },
  {
    path: 'match',
    loadChildren: './forms/match/match.module#MatchPageModule'
  },
  {
    path: 'match/:competitionId/:id',
    loadChildren: './forms/match/match.module#MatchPageModule'
  },
  {
    path: 'matches',
    loadChildren: './list/matches/matches.module#MatchsPageModule'
  },
  {
    path: 'matches/:competitionId',
    loadChildren: './list/matches/matches.module#MatchsPageModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
