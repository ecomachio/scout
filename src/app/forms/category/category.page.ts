import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/entity/category';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: Category;

  constructor(private pickerController: PickerController) { }

  ngOnInit() {
    this.category = new Category();
  }

}
