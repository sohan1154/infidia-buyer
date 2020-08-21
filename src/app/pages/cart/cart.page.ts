import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  appID: any = null;
  cartSize: any;
  sellerInfo: any;
  products: any = [];
  totalAmt: number = 0;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {

    this.currentUser = this.global.currentUser;
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

    console.log('cart page is called')

    setTimeout(() => {
      this.currentUser = this.global.currentUser;

      this.getCartProductsList();
    }, 2000)
    
  }

  getCartProductsList() {

    // this.global.showloading();

    let params = {
      app_id: this.appID,
      user_id: this.currentUser.id,
    };

    this.apis.productListCart(params).subscribe(
      (result: any) => {

        console.log('result:', result);
        // this.global.hideloading();

        if (result.status == "1") {

          this.products = result.cartData;
          this.sellerInfo = result.cartData[0];

          // calculate total amount
          this.calculateTotalAmt();
        }
      },
      (err: any) => {
        console.error(err);
        this.global.hideloading();
        this.global.showMsg(err);
      });
  }

  gotoProductDetailPage(productID) {
    console.log('productID:::::', productID);

    this.navCtrl.navigateForward(['/product-detail/', productID]);
  }

  deleteItem(cart_id, index) {

    let _this = this;

    this.global.presentAlertConfirm('Are you sure, you want to delete this item.', function (cancel, confirm) {

      if (cancel) {
        console.log('cancelled button called')
      }
      else if (confirm) {


        _this.global.showloading();

        let params = {
          app_id: _this.appID,
          user_id: _this.currentUser.id,
          cart_id: cart_id,
        };

        _this.apis.removeFromCart(params).subscribe(
          (result: any) => {

            console.log('result:', result);
            _this.global.hideloading();

            if (result.status == "1") {

              _this.products.splice(index, 1);

              // update cart size
              _this.cartSize = localStorage.getItem('cartSize');
              _this.cartSize = parseInt(_this.cartSize) - 1;
              localStorage.setItem('cartSize', _this.cartSize);

              // re-calculate total amount
              this.calculateTotalAmt();

            } else {
              _this.global.showMsg(result.msg);
            }
          },
          (err: any) => {
            console.error(err);
            _this.global.hideloading();
            _this.global.showMsg(err);
          });
      }
    })
  }

  updateProductQty(action, product, index) {

    if (product.qty == 1 && action == 'remove') {
      
      // remove item from cart

      let params = {
        app_id: this.appID,
        user_id: this.currentUser.id,
        cart_id: product.cart_id,
      };

      this.global.showloading();
      
      this.apis.removeFromCart(params).subscribe(
        (result: any) => {

          console.log('resultult:', result);
          this.global.hideloading();

          if (result.status == "1") {

            this.products.splice(index, 1);

            // update cart size
            localStorage.setItem('cartSize', result.count);

            // re-calculate total amount
            this.calculateTotalAmt();

          } else {
            this.global.showMsg(result.msg);
          }
        },
        (err: any) => {
          console.error(err);
          this.global.hideloading();
          this.global.showMsg(err);
        });

    } else {

      // decrease item quantity from cart

      let order_qty = (action == 'add') ? (Number(product.qty) + 1) : (Number(product.qty) - 1);

      let params = {
        app_id: this.appID,
        user_id: this.currentUser.id,
        cart_id: product.cart_id,
        price: product.sale_price,
        qty: order_qty,
      };

      this.global.showloading();

      this.apis.updateProductCart(params).subscribe(
        (result: any) => {

          console.log('result:', result);
          this.global.showloading();

          if (result.status == "1") {

            this.products[index].qty = result.cartData.qty;
            this.products[index].total = result.cartData.total;
            
            // re-calculate total amount
            this.calculateTotalAmt();

          } else {
            this.global.showMsg(result.msg);
          }
        },
        (err: any) => {
          console.error(err);
          this.global.hideloading();
          this.global.showMsg(err);
        });
    }
  }

  calculateTotalAmt() {
    
    this.totalAmt = 0;
    
    for (var i = 0; i < this.products.length; i++) {
      this.totalAmt += this.products[i].total;
    }

    console.log(this.totalAmt);
  }

  gotoPayment() {
    // if (localStorage.getItem('selectedAddressID') == '') {
    //   console.log('addselectpage');
    //   let selectAddressScreen = this.modalCtrl.create('SelectAddressPage');
    //   selectAddressScreen.onDidDismiss((val) => {
    //     if (val == 'gotoNewAddress') {
    //       this.navCtrl.push('AddAddressPage');
    //     } else if (val == 'olderAddress') {
    //       // this.payment();
    //       this.navCtrl.push('CartPaymentModePage');
    //     }
    //   });
    //   selectAddressScreen.present();

    // } else {
    //   // this.payment();
    //   this.navCtrl.push('CartPaymentModePage');
    //   this.navCtrl.navigateForward(['/product-detail', { productDetail: product });
    // }


    let navigationExtras: NavigationExtras = {
      state: {
        products: this.products
      }
    };
    this.router.navigate(['/payment-mode-from-cart'], navigationExtras);

  }

}

