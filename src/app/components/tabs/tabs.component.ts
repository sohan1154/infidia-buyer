import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {}

  gotoHome() {
    this.navCtrl.navigateForward('home');
  }

  gotoCategories() {
    this.navCtrl.navigateForward('categories');
  }

  gotoSearch() {

    let category_id = 0;

    this.navCtrl.navigateForward(['search', category_id]);
  }

  gotoOrders() {
    this.navCtrl.navigateForward('orders');
  }

  gotoOffers() {
    this.navCtrl.navigateForward('offers');
  }

}
