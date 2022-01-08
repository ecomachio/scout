import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Category } from "../entity/category";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private categoriesCollection: AngularFirestoreCollection<Category>;
  private categories: Observable<Category[]>;

  constructor(db: AngularFirestore) {
    this.categoriesCollection = db.collection<Category>("categories", (ref) =>
      ref.orderBy("name")
    );

    this.categories = this.categoriesCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  getCategoriesCollection() {
    return this.categoriesCollection;
  }

  getCategories() {
    return this.categories;
  }

  getCategory(id) {
    return this.categoriesCollection.doc<Category>(id).get();
  }

  updateCategory(category: Category, id: string) {
    return this.categoriesCollection.doc<Category>(id).update(category);
  }

  addCategory(category: Category) {
    return this.categoriesCollection.add({ ...category });
  }

  removeCategory(id) {
    return this.categoriesCollection.doc(id).delete();
  }
}
