import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/entity/category';
import { PickerController, NavController, LoadingController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { CompetitionService } from 'src/app/services/competition.service';
import { Competition } from 'src/app/entity/competition';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: Category;
  competition: Competition;
  competitionId: string;

  constructor(
    private pickerController: PickerController,
    private categoryService: CategoryService,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.category = new Category();
    const categoryId = this.route.snapshot.params.id;
    if (categoryId) {
      this.loadCategory(categoryId);
    }
  }

  async loadCategory(categoryId) {
    const loading = await this.loadingController.create({
      message: 'Loading Category..'
    });
    await loading.present();

    this.categoryService.getCategory(categoryId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.category = res.data() as Category;
      this.category.id = categoryId;
    });
  }

  async removeCategory() {
    if (this.category.id) {
      await this.categoryService.removeCategory(this.category.id);
    }
    this.utilsService.showToast('Aluno excluído');
    this.router.navigateByUrl('/categories');
  }

  async done() {
    if (this.category.id) {
      await this.categoryService.updateCategory(this.category, this.category.id);
    } else {
      await this.categoryService.addCategory(this.category);
    }
    this.utilsService.showToast('Pronto');
    this.router.navigateByUrl(`/categories`);
  }

}
