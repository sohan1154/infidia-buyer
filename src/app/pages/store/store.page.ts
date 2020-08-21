import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the ShopProductsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  currentUser: any;
  store_id: any;
  product_category_id: any = 0;
  search: string = '';
  store_info: any;
  business_categories: any;
  products: any;

  constructor(
    private route: ActivatedRoute,
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService
  ) {

  }

  ngOnInit() {

    this.currentUser = this.global.currentUser;
    
    this.route.paramMap.subscribe(paramMap => {
      this.store_id = paramMap.get('store_id');
      console.log('store-id:', this.store_id)

      this.getStorePageData();

    });

  }

  ionViewWillEnter() {
    
  }

  getStorePageData() {

    let params = {
      shop_id: this.store_id,
    };

    this.apis.getStorePageData(params)
      .subscribe((result: any) => {

        console.log('result:', result);

        if (result.status == '1') {
          this.store_info = result.store_info;
          this.business_categories = result.business_categories;

          // update category id value
          if(this.business_categories.length > 0) {
            this.product_category_id = this.business_categories[0].category_id;
            console.log('this.product_category_id in-side:', this.product_category_id)
  
            // get products
            this.getProducts();
          }
        } else {
          this.global.showMsg(result.msg);
        }
      },
        error => {
          console.error(error.msg);
          this.global.showMsg(error);
        });
  }

  filterProducts(catID) {
    this.product_category_id = catID;

    // get products
    this.getProducts();
  }

  onSearchChange(e) {
    this.search = e.detail.value;
    console.log(this.search);

    this.getProducts();
  }

  getProducts() {

    this.global.showSortLoading();

    let params = {
      shop_id: this.store_id,
      user_id: this.currentUser.id,
      product_category_id: this.product_category_id,
      search: this.search,
    };
    console.log('this.product_category_id out-side:', this.product_category_id)

    this.apis.storeProductList(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.products = result.products;
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

  gotoProductDetailPage(productID) {
    console.log('productID:::::', productID);
    
    this.navCtrl.navigateForward(['/product-detail/', productID]);
  }

  gotoOffers() {
    this.navCtrl.navigateForward('offers');
  }

}
