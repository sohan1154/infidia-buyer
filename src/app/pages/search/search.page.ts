import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  currentUser: any;
  catID: any;
  results: any = [];
  resultType: string = 'Stores';
  search: string = '';

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
      this.catID = paramMap.get('category_id');
      console.log('category-id:', this.catID)

      if(this.resultType == "Products") {
        this.getProductsListing();
      }
      else {
        this.getStoresListing();
      }

    });

  }

  ionViewWillEnter() {
    
  }

  tabChanged(e) {
    console.log('button clicked', e)

    this.resultType = e.detail.value;

    if(this.resultType == "Products") {
      this.getProductsListing();
    }
    else {
      this.getStoresListing();
    }
  }

  onSearchChange(e) {
    this.search = e.detail.value;
    console.log(this.search);

    if(this.resultType == "Products") {
      this.getProductsListing();
    }
    else {
      this.getStoresListing();
    }
  }

  getStoresListing() {

    let params = {
      cat_id: this.catID,
      search:this.search,
    };

    this.global.showloading();

    this.apis.storesListBasedCategory(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.results = result.data;
          this.resultType = 'Stores';
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

  getProductsListing() {

    let params = {
      cat_id: this.catID,
      search:this.search,
    };

    this.global.showloading();
    
    this.apis.productsListBasedCategory(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.results = result.data;
          this.resultType = 'Products';
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

  isHide(type) {

    return false;
    if(this.resultType==type) {
      return true;
    } else {
    }
  }

  gotoNextScreen(index) {
    
    let id;

    let singleItem = this.results[index];
    
    if(this.resultType == 'Stores') {

      id = singleItem.store_id;
      
      console.log('goto store page:::::', id);
      this.navCtrl.navigateForward(['/store/', id]);
    } else {
      
      id = singleItem.product_id;

      console.log('goto product detail page:::::', id);
      this.navCtrl.navigateForward(['/product-detail/', id]);
    }
  }

}
