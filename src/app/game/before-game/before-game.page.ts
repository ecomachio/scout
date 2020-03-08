import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Competition } from 'src/app/entity/competition';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';
import { IonSlides } from '@ionic/angular';
import { Category } from 'src/app/entity/category';
import { CategoryService } from 'src/app/services/category.service';
import { Match } from 'src/app/entity/match';
import { MatchService } from 'src/app/services/match.service';
import { QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-before-game',
  templateUrl: './before-game.page.html',
  styleUrls: ['./before-game.page.scss'],
})
export class BeforeGamePage implements OnInit, OnDestroy {

  @ViewChild('beforeGameSlider', { static: true }) slides: IonSlides;

  competitions: Array<Competition> = new Array();
  categories: Array<Category> = new Array();
  matches: Array<Match> = new Array();

  selectedCompetition: Competition;
  selectedCategory: Category;
  selectedMatch: Match;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(
    private competitionsService: CompetitionService,
    private categoryService: CategoryService,
    private matchService: MatchService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.competitionsService.getCompetitions().subscribe(comp => this.competitions = comp);
    this.categoryService.getCategories().subscribe(cat => this.categories = cat);
    this.slides.lockSwipeToNext(true);
  }

  ionSlideWillChange(e) {
    this.slides.lockSwipeToNext(true);
  }

  async nextSlide(selectedEntity) {
    if (await this.slides.isEnd()) {
      this.router.navigateByUrl(`/game`);
    }

    switch (await this.slides.getActiveIndex()) {
      case 0:
        this.selectedCompetition = selectedEntity as Competition;
        break;
      case 1:
        this.selectedCategory = selectedEntity as Category;

        if (this.selectedCompetition && this.selectedCategory) {
          this.matches = await this.filterMatches(this.selectedCompetition, this.selectedCategory);
        }

        break;
      case 2:
        this.selectedMatch = selectedEntity as Match;
        break;
      default:
        break;
    }
    await this.slides.lockSwipeToNext(false);
    await this.slides.slideNext();
  }

  async filterMatches(competition, category) {
    let matches;
    matches = await this.matchService.getMatchesByCompetition(competition.id).then((res: any) => {
      if (!res) {
        this.matches = [];
      }
      return matches = res.docs.map((m: QueryDocumentSnapshot<Match>) => {
        const id = m.id;
        return { id, ...m.data() } as Match;
      });
    });

    return matches.filter((m: Match) => {
      if (m.category) {
        return m.category.id === category.id;
      } else {
        return false;
      }
    });
  }

  ngOnDestroy() {


  }

}
