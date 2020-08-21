import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { serialize, unserialize } from 'php-serialize'
import { ListAddressPage } from '../list-address/list-address.page';
import { AddAddressPage } from '../list-address/add-address/add-address.page';
import { EditAddressPage } from '../list-address/edit-address/edit-address.page';

/**
 * Generated class for the PaymentModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var RazorpayCheckout: any;
@Component({
  selector: 'app-payment-mode-from-cart',
  templateUrl: './payment-mode-from-cart.page.html',
  styleUrls: ['./payment-mode-from-cart.page.scss'],
})
export class PaymentModeFromCartPage implements OnInit {
  currentUser: any;
  product_id: any = 0;
  product_info: any;
  commonData: any = [];
  productDetail: any = [];
  productImages: any = [];
  gallery_images: any = [];
  selectAttibute: any = [];
  productAttributes: any = [];
  conditionalResult: any = [];
  filters: any = [];
  tabVal: any = '0';
  heartRate: any = false;
  showUnit: any = false;
  itemsInCart: Object[] = [];
  cartValue: any = [];
  cartSize: any = 0;
  currentCart: any;
  val: any;
  dataset: any;
  appendVal: boolean = false;
  currPlt: any;
  userID: any;
  sellerID: any;
  wishlistSize: any;
  proAttrID: any = '';
  deviceID: any = '';
  lottieAnime: any = false;
  lottieAnimeCart: any = false;
  totalAmt: any = 0;
  selectedAddress: any = {}
  selectedPaymentMode: string; // cash/online

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

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.productDetail = this.router.getCurrentNavigation().extras.state.productDetail;

        console.log('productDetail:', this.productDetail)

        this.sellerID = this.productDetail.seller_id;
        this.userID = this.currentUser.id;
      }
    });

    this.currentUser = this.global.currentUser;
    this.assignLocalStorageVlueToLocalVeriables();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  assignLocalStorageVlueToLocalVeriables() {

    console.log('assignLocalStorageVlueToLocalVeriables is called')

    this.selectedAddress = JSON.parse(localStorage.getItem('selectedAddress'));

    this.cartSize = localStorage.getItem('cartSize');
  }

  buyOnCash(data) {

    console.log('buy on cash');
    console.log('selected-address:', this.selectedAddress)

    this.selectedPaymentMode = 'cash'; // cash/online

    if (this.selectedAddress == null) {

      this.presentAddressListPage();

    } else {
      if (this.cartSize > 0) {
        this.cashOnDelivery(data);
      } else {
        this.global.showMsg('Add quantity first for buy product');
      }
    }
  }

  cashOnDelivery(data) {

    let _this = this;

    this.totalAmt = this.cartSize * data.sale_price;
    let productInfo = {
      amount: [],
      product_attr_id: [],
      product_id: [],
      qty: []
    };
    let userID = this.userID;
    let sellerID = this.sellerID;
    let totalAmt = this.totalAmt;
    let globalvar = this.global;
    let restProvider = this.apis;
    let navCtrl = this.navCtrl;
    productInfo.amount.push(this.totalAmt);
    productInfo.product_attr_id.push(data.id);
    productInfo.product_id.push(data.id);
    productInfo.qty.push(this.cartSize);

    console.log('productInfo:', productInfo);

    let options = {
      user_id: userID,
      app_id: localStorage.getItem('deviceID'),
      payment_status: '1',
      tnx_id: null,
      amount: serialize(productInfo.amount),
      billing_address: this.selectedAddress.id,
      shipping_address: this.selectedAddress.id,
      product_attr_id: serialize(productInfo.product_attr_id),
      product_id: serialize(productInfo.product_id),
      total_amount: totalAmt,
      qty: serialize(productInfo.qty),
      seller_id: sellerID,
    };
    console.log('options:', options);

    globalvar.showloading();

    restProvider.userCashOrder(options).subscribe(
      (output: any) => {

        console.log('output:', output);
        globalvar.hideloading();

        if (output.status == '1') {

          _this.emptyFullCart();
          navCtrl.navigateForward('/thankyou');

        } else {
          globalvar.showMsg(output.msg);
        }
      },
      (err: any) => {
        globalvar.hideloading();
        globalvar.showMsg(err);
        console.log(err);
      }
    );
  }

  async presentAddressAddPage() {
    const modal = await this.modalCtrl.create({
      component: AddAddressPage,
      componentProps: { value: 123 }
    });

    modal.onDidDismiss()
      .then((response: any) => {

        console.log('response:::', response)

        this.assignLocalStorageVlueToLocalVeriables();

        // add address page open
        if (response.data.action == 'list-address') {
          console.log('present list address popup')
          this.presentAddressListPage();
        }

      });

    return await modal.present();
  }

  async presentAddressEditPage(address) {
    const modal = await this.modalCtrl.create({
      component: EditAddressPage,
      componentProps: { address: address }
    });

    modal.onDidDismiss()
      .then((response: any) => {

        console.log('response:::', response)

        this.assignLocalStorageVlueToLocalVeriables();

        // add address page open
        if (response.data.action == 'list-address') {
          console.log('present list address popup')
          this.presentAddressListPage();
        }

      });

    return await modal.present();
  }

  async presentAddressListPage() {
    const modal = await this.modalCtrl.create({
      component: ListAddressPage,
      componentProps: { value: 123 }
    });

    modal.onDidDismiss()
      .then((response: any) => {

        console.log('response:::', response)

        this.assignLocalStorageVlueToLocalVeriables();

        // add address page open
        if (response.data.action == 'add-address') {
          console.log('present add address popup')
          this.presentAddressAddPage();
        }
        else if (response.data.action == 'edit-address') {
          console.log('present edit address popup')
          this.presentAddressEditPage(response.data.address);
        }

      });

    return await modal.present();
  }

  buyNow(data) {

    console.log('buy online payment');
    console.log('selected-address:', this.selectedAddress)

    this.selectedPaymentMode = 'online'; // cash/online

    if (this.selectedAddress == null) {

      this.presentAddressListPage();

    } else {
      if (this.cartSize > 0) {
        this.payment(data);
      } else {
        this.global.showMsg('Add quantity first for buy product');
      }
    }
  }

  payment(data) {
    console.log('here');
    console.log('data:', data);


    let _this = this;

    this.totalAmt = this.cartSize * data.sale_price;
    let productInfo = {
      amount: [],
      product_attr_id: [],
      product_id: [],
      qty: []
    };
    let userID = this.userID;
    let sellerID = this.sellerID;
    let totalAmt = this.totalAmt;
    let globalvar = this.global;
    let restProvider = this.apis;
    let navCtrl = this.navCtrl;
    productInfo.amount.push(this.totalAmt);
    productInfo.product_attr_id.push(data.id);
    productInfo.product_id.push(data.id);
    productInfo.qty.push(this.cartSize);

    console.log('productInfo:', productInfo);

    

    var options = {
      description: data.name,
      image: localStorage.getItem('sellerImg'),
      currency: 'INR',
      //key: 'rzp_test_1DP5mmOlF5G5ag',
      key: 'rzp_live_0Z5GQt7u3554Jd',
      amount: this.totalAmt * 100,
      name: data.seller_name,
      prefill: {
        name: localStorage.getItem('loggedUserName'),
        email: localStorage.getItem('loggedUserEmail'),
        contact: localStorage.getItem('loggedUserMobile')
      },
      theme: {
        color: '#488aff'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed');
        }
      }
    };

    console.log('options:', options);

    var successCallback = function (payment_id) {
      console.log('payment made successfully trainsaction id:' + payment_id);

      let options = {
        user_id: userID,
        app_id: localStorage.getItem('deviceID'),
        payment_status: '1',
        tnx_id: payment_id,
        amount: serialize(productInfo.amount),
        billing_address: this.selectedAddress.id,
        shipping_address: this.selectedAddress.id,
        product_attr_id: serialize(productInfo.product_attr_id),
        product_id: serialize(productInfo.product_id),
        total_amount: totalAmt,
        qty: serialize(productInfo.qty),
        seller_id: sellerID,
      };
      console.log('options:', options);

      globalvar.showloading();
      restProvider.userOrder(options).subscribe(
        (output: any) => {
          console.log('output:', output);
          globalvar.hideloading();
          if (output.status == '1') {
            _this.emptyFullCart();
            navCtrl.navigateForward('ThanksPage');
          } else {
            globalvar.showMsg(output.msg);
          }
        },
        (err: any) => {
          globalvar.hideloading();
          globalvar.showMsg(err);
          console.log(err);
        }
      );
    };

    var cancelCallback = function (error) {
      // console.log(error);
      // alert(error.description + ' (Error ' + error.code + ')');
      globalvar.showMsg(error.description);
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  // dummy payment method
  dummypayment(payment_id) {
    console.log('payment made successfully trainsaction id:' + payment_id);

    let _this = this;
    let options = {
      user_id: 34,
      //app_id: '1',
      app_id: 555,
      payment_status: '1',
      tnx_id: payment_id,
      amount: serialize(1),
      billing_address: this.selectedAddress.id,
      shipping_address: this.selectedAddress.id,
      product_attr_id: serialize(0),
      product_id: serialize(15),
      total_amount: 1,
      qty: serialize(1),
      seller_id: 8
    };
    console.log('options:', options);

    this.apis.userOrder(options).subscribe(
      (output: any) => {
        console.log('output:', output);
        if (output.status == '1') {
          console.log('payment successfully saved into database')
          _this.emptyFullCart();
        } else {
          console.log('error in payment saving into database')
        }
      },
      (err: any) => {
        console.log('err::::', err);
      }
    );
  }

  emptyFullCart() {

    let params = {
      user_id: this.currentUser.id,
    };

    this.apis.emptyCart(params).subscribe(
      (res: any) => {
        console.log(res);

        // localStorage.setItem('cartSize', res.cartData);
        // this.events.publish('updateCart');

      },
      (err: any) => {
        console.log(err);
        this.global.showMsg(err);
      }
    );
  }

}

