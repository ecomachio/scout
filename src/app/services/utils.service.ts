import { ToastController } from "@ionic/angular";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(private toastController: ToastController) {}

  showToast(msg) {
    this.toastController
      .create({
        message: msg,
        duration: 2000,
      })
      .then((toast) => toast.present());
  }

  toPlainObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  orderListByProperty(list: Array<any>, property: string): Array<any> {
    return list.sort((a, b) => {
      return a[property] - b[property];
    });
  }
}
