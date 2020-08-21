import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  currentUser: any;
  categories: any = [];

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
    
    this.loadData();
  }

  loadData() {

    this.global.showloading();

    let params = {};

    this.apis.categoryListing(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.categories = result.categories;
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

  toggle(objIndex) {

    let isDisplay = false;
    if(typeof this.categories[objIndex].isDisplay === 'undefined' || !this.categories[objIndex].isDisplay) {
      isDisplay = true;
    }

    let category = this.categories[objIndex];
    Object.assign(category, {isDisplay: isDisplay});

    this.categories[objIndex] = category;
  }

  isHide(objIndex) {
    
    let category = this.categories[objIndex];

    let isHide = true;
    if(typeof category.isDisplay !== 'undefined' && category.isDisplay) {
      isHide = false;
    }
    
    return isHide;
  }
  
  gotoShopList(catID) {
    console.log('goto shop list:', catID);
    this.navCtrl.navigateForward(['/search/', catID]);
  }
  
}
