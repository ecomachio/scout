import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';
import { LoadingController } from '@ionic/angular';
import { Match } from 'src/app/entity/match';
import { MatchService } from 'src/app/services/match.service';
import { QueryDocumentSnapshot, QuerySnapshot } from 'angularfire2/firestore';
import { Player } from 'src/app/entity/player';
import { PlayerService } from 'src/app/services/player.service';
import { Category } from 'src/app/entity/category';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.page.html',
  styleUrls: ['./competition.page.scss', '../../reports.page.scss'],
})
export class CompetitionPage implements OnInit {

  competition: Competition;
  matches: Array<Match> = [];
  goals: number;
  players: Array<Player> = [];
  categoriesQtd: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.loadCompetition(id);
  }

  async loadCompetition(competitionId) {
    const loading = await this.loadingController.create({
      message: 'Loading Competition..'
    });

    await loading.present();

    this.competitionService.getCompetition(competitionId).subscribe(async res => {
      loading.dismiss();
      this.competition = res.data() as Competition;
      this.competition.id = res.id;

      this.matches = await this.getMatches(this.competition);

      // count all goals in all matches
      this.goals = this.matches.reduce((pv, cv, i) => pv + cv.score.away + cv.score.home, 0);

      let playersByCatPromises: Array<Promise<QuerySnapshot<firebase.firestore.DocumentData>>> = [];

      this.categoriesQtd = new Set(this.matches.map(m => m.category.id)).size;

      playersByCatPromises = this.matches.map(m => this.playerService.getPlayersByCategory(m.category.id));

      Promise.all(playersByCatPromises).then((playersQuerySnapshot) => {
        const allPLayers = [];

        playersQuerySnapshot.forEach((pp: QuerySnapshot<firebase.firestore.DocumentData>) => {
          pp.docs.forEach((p: QueryDocumentSnapshot<Player>) => {
            const id = p.id;
            allPLayers.push({ id, ...p.data() } as Player);
          });
        });

        // remove all duplicates
        this.players = Array.from(new Set(allPLayers.map(a => a.id)))
          .map(id => allPLayers.find(a => a.id === id));

      });
    });
  }

  async getMatches(competition) {
    let matches: Array<Match>;
    matches = await this.matchService.getMatchesByCompetition(competition.id).then((res: any) => {
      if (!res) {
        this.matches = [];
      }
      return matches = res.docs.map((m: QueryDocumentSnapshot<Match>) => {
        const id = m.id;
        return { id, ...m.data() } as Match;
      });
    });

    matches.sort((a, b) => {
      if (isNaN(+a.date)) {
        return 1;
      } else if (isNaN(+b.date)) {
        return -1;
      }
      return +a.date - +b.date;
    });

    return matches;
  }

}
