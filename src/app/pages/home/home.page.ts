import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  currentUser: any;
  banners: any;
  categories: any;
  sellers: any;

  constructor(
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService
  ) {

  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    
    // get user information from storage
    this.storage.get('user').then((user) => {
      
      console.log('##################### user:', user);
      this.currentUser = this.global.currentUser;
      console.log('ionViewWillEnter.currentUser:', this.currentUser)

      if (user) {
        this.homePageInformation();
      }
    })
  }

  homePageInformation() {

    this.global.showSortLoading();

    console.log('homePageInformation.currentUser:', this.currentUser)
    let params = {
      user_id: this.currentUser.id,
      role: this.global.role,
      app_id: ''
    };

    this.apis.homeData(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.banners = result.banners;
          this.categories = result.categories;
          this.sellers = result.sellers;
        } else {
          this.global.showMsg(result.msg);
        }
      },
        error => {
          console.error(error.msg);
          this.global.hideloading();
          this.global.showMsg(error);
        });
  }

  orderDetail(orderID) {
    console.log('Detail page is comming soon...')
    this.navCtrl.navigateForward('order-detail/'+orderID);
  }

  gotoShopProductsList(store_id) {
    console.log('store_id:::::', store_id);
    
    this.navCtrl.navigateForward(['/store/', store_id]);
  }

  gotoShopList(category_id) {
    console.log('category_id:::::', category_id);
    
    this.navCtrl.navigateForward(['/search/', category_id]);
  }

}

