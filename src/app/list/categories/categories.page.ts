import { Component, OnInit } from "@angular/core";
import { CategoryService } from "src/app/services/category.service";
import { Category } from "src/app/entity/category";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  categories: Array<Category>;

  constructor(
    private categoryService: CategoryService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((res) => {
      console.log(res);
      this.categories = res;
    });
  }

  async remove(item) {
    try {
      await this.categoryService.removeCategory(item.id);
      this.utilsService.showToast("Categoria excluída");
    } catch (error) {
      this.utilsService.showToast(`Opa! algo de errado ${error}`);
    }
  }
}
