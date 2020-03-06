import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadChildren: () => import('./game//in-game/game.module').then(m => m.GamePageModule)
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
    path: 'category/:id',
    loadChildren: './forms/category/category.module#CategoryPageModule'
  },
  {
    path: 'categories',
    loadChildren: './list/categories/categories.module#CategoriesPageModule'
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
  {
    path: 'team',
    loadChildren: './forms/team/team.module#TeamPageModule'
  },
  {
    path: 'team/:id',
    loadChildren: './forms/team/team.module#TeamPageModule'
  },
  {
    path: 'teams',
    loadChildren: './list/teams/teams.module#TeamsPageModule'
  },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'before-game', loadChildren: './game/before-game/before-game.module#BeforeGamePageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
