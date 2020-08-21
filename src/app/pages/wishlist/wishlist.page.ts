import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {

  currentUser: any;
  products: any = [];

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

    this.getWishlistItems();
  }

  ionViewWillEnter() {

  }

  getWishlistItems() {

    let params = {
      user_id: this.currentUser.id,
      app_id: 1,
    };

    this.global.showloading();

    this.apis.productListWishlist(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();
        
        if (result.status == '1') {
          this.products = result.Data;
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

  deleteItemFromWishlist(product_id, i) {

    let _this = this;

    this.global.presentAlertConfirm('Are you sure, you want to remove this product from wishlist?', function(cancel, confirm) {
      
      if(confirm) {

        let params = {
          user_id: _this.currentUser.id,
          app_id: 1,
          id: product_id,
        };

        _this.global.showloading();

        _this.apis.removeFromWishlist(params)
          .subscribe((result: any) => {

            console.log('result:', result);
            _this.global.hideloading();

            if (result.status == '1') {

              
              // remove this product from wishlist array
              let remainingProducts = _this.products.filter(function(product) {

                console.log(product.id, '!=', product_id)
                if(product.id != product_id) {
                  return product;
                }
              })
              
              _this.products = remainingProducts;
              //_this.products = result.Data;

            } else {
              _this.global.showMsg(result.msg);
            }
          },
            error => {
              console.error(error.msg);
              _this.global.hideloading();
              _this.global.showMsg(error);
            });

          } else {

            console.log('cancel button called.')
          }
        })
  }

  gotoProductDetailPage(product_id) {
    this.navCtrl.navigateForward(['/product-detail/', product_id]);
  }

}
