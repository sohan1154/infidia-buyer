import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {serialize, unserialize} from 'php-serialize'
// import { GalleryModal } from 'ionic-gallery-modal';
import { ListAddressPage } from '../list-address/list-address.page';

declare var RazorpayCheckout: any;
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService,
    private platform: Platform,
  ) {

  }

  ngOnInit() {

    this.currentUser = this.global.currentUser;

    this.route.paramMap.subscribe(paramMap => {
      this.product_id = paramMap.get('product_id');
      console.log('product-id:', this.product_id)

      this.getProductDetail();

    });
  }

  ionViewWillEnter() {
    
  }

  getProductDetail() {

    this.global.showloading();

    let params = {
      product_id: this.product_id,
      user_id: this.currentUser.id,
    };

    this.apis.getProductDetail(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          // console.log(res.product);
          this.commonData = result.product;
          this.productDetail = result.product;

          this.sellerID = this.productDetail.seller_id;

          if (this.productDetail.wishlist == 1) {
            // console.log('1');
            this.heartRate = true;
          } else {
            // console.log('0');
            this.heartRate = false;
          }

          this.conditionalResult = this.productDetail;
          
          if (this.productDetail.product_attribute.length != 0) {
            this.productAttributes = this.productDetail.product_attribute;
            this.selectAttibute = this.productDetail.product_attribute;
            console.log('selectAttibute:::', this.selectAttibute);
          }
          this.productAllData();
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

  productAllData() {
    console.log(this.productDetail.wishlist);
    this.productImages = this.productDetail.product_images;
    for (let i = 0; i < this.productImages.length; i++) {
      this.gallery_images.push({ url: this.productImages[i].image });
    }
    console.log('productDetail:::', this.productDetail);
    console.log('productImages:::', this.productImages);
    console.log('gallery_images:::', this.gallery_images);
    
    //this.sellerID = this.productDetail.product.seller_id;

    if (this.platform.is('android')) {
      this.currPlt = 'android';
    }
    if (this.platform.is('ios')) {
      this.currPlt = 'ios';
    }
    if (this.platform.is('cordova')) {
      this.currPlt = 'browser';
    }

  }

  showSelectValue(type, value) {

    let _this = this;
    
    //console.log('type:', type, ' &value:', value)
    
    // if (this.conditionalResult.length == 0) {
    //   this.conditionalResult = this.selectAttibute;
    // }

    this.cartSize = 0;
    this.showUnit = false;

    let count = 0;
    let selectedDatas = [];

    if (this.filters.length == 0) {
      this.filters.push({
        [type]: value
      });
    } else {
      this.filters.findIndex(res => {
        if (res[type]) {
          res[type] = value;
          count++;
          //when value updated ex: Color : change from red to green
          //this.conditionalResult = this.productAttributes;
        }
      });
      if (count == 0) {
        this.filters.push({
          [type]: value
        });
      }
    }
    console.log('filters:', this.filters);

    let isProductMatched = false;
    this.productAttributes.find(function(attrProduct) {

      attrProduct.attrs.find(function(singleAttr) {
        console.log('singleAttr:::', singleAttr)


        let isPassed = '';
        _this.filters.find(function(singleFilter) {
          console.log('singleFilter:::', singleFilter)

          let filterKyeValue;
          Object.keys(singleFilter).forEach(function (key) {

            filterKyeValue = {name: key, value: singleFilter[key]};

            if(singleAttr.name == filterKyeValue.name && singleAttr.value == filterKyeValue.value) {
              isPassed += 'true:';
            } else {
              isPassed += 'false:';
            }

          });
        });

        console.log('isPassed=====', isPassed);
        if (isPassed.indexOf('false') == -1) {
          console.log('in side');
          isProductMatched = true;
          _this.conditionalResult = attrProduct;
        }
  
  
          // console.log(singleAttr.name, '==', filterKyeValue.name, '&&', singleAttr.value, '==', filterKyeValue.value)
  
          // if(singleAttr.name == filterKyeValue.name && singleAttr.value == filterKyeValue.value) {
  
          //   _this.conditionalResult = attrProduct;
          //   isProductMatched = true;
          //   console.log('isProductMatched11111:', isProductMatched)
          // }
          
        
        

      })


      


    })

    console.log('isProductMatched:', isProductMatched)
    if(!isProductMatched) {
      this.global.showMsg('Product is Out of Stock');
    }




    


    
    // internalFilters.forEach(function (item) {
    //   Object.keys(item).forEach(function (key) {
    //     if (data[key] == item[key] && data[type] == value) {
    //       isPassed += 'true:';
    //     } else {
    //       isPassed += 'false:';
    //     }
    //   });
    // });
    // console.log('isPassed=====', isPassed);
    // if (isPassed.indexOf('false') == -1) {
    //   console.log('in side');
    //   selectedDatas.push(data);
    //   console.log('selectedDatas:', selectedDatas);
    // }
    


    // let internalFilters = this.filters;
    // //let finalResult = this.conditionalResult;
    // let finalResult = this.productAttributes;
    // console.log('finalResult:', finalResult);
    // finalResult.find(function (data) {
    //   let isPassed = '';

    //   internalFilters.forEach(function (item) {
    //     Object.keys(item).forEach(function (key) {
    //       if (data[key] == item[key] && data[type] == value) {
    //         isPassed += 'true:';
    //       } else {
    //         isPassed += 'false:';
    //       }
    //     });
    //   });
    //   console.log('isPassed=====', isPassed);
    //   if (isPassed.indexOf('false') == -1) {
    //     console.log('in side');
    //     selectedDatas.push(data);
    //     console.log('selectedDatas:', selectedDatas);
    //   }
    // });
    // console.log('1111:', selectedDatas);
    // if (selectedDatas.length == 1) {
    //   if (selectedDatas[0].qty > 0) {
    //     this.gallery_images = [];
    //     this.productImages = selectedDatas[0].image;
    //     for (let i = 0; i < this.productImages.length; i++) {
    //       this.gallery_images.push({ url: this.productImages[i].image });
    //     }
    //     //this.productDetail.sale_price = selectedDatas[0].price;
    //     console.log('commonData:', this.commonData);

    //     console.log('productDetail111111:', this.productDetail);
    //   } else {
    //     this.globalvar.presentInfoToast('Out of Stock');
    //   }
    // }
    // if (selectedDatas.length == 0) {
    //   //this.productDetail = this.commonData;
    //   this.gallery_images = [];
    //   console.log('sale_price:', this.commonData.sale_price);
    //   this.productDetail.sale_price = this.commonData.sale_price;
    //   this.productImages = this.productDetail.product_images;
    //   for (let i = 0; i < this.productImages.length; i++) {
    //     this.gallery_images.push({ url: this.productImages[i].image });
    //   }

    //   this.globalvar.presentInfoToast('Out of Stock');
    // }
  }
  
  gotoCart() {
    this.navCtrl.navigateForward('/cart');
  }

  removeToCart(data) {
    this.dataset = data;
    this.currentCart = this.currentCart - 1;
    if (
      localStorage.getItem('cartSize') != null &&
      localStorage.getItem('cartSize') != '0'
    ) {
      if (localStorage.getItem('cartSize') > '0') {
        this.cartSize = parseInt(this.cartSize) - 1;
        localStorage.setItem('cartSize', this.cartSize);

        for (this.val = 0; this.val < this.cartValue.length; this.val++) {
          console.log(
            this.cartValue[this.val].productID,
            '==',
            this.dataset.id
          );
          if (this.cartValue[this.val].productID == this.dataset.id) {
            this.appendVal = true;
            this.cartValue[this.val].quantity = this.currentCart;
          }
        }
      }
      console.log(this.appendVal);
      if (!this.appendVal) {
        this.cartValue.push({
          product: this.dataset,
          productID: this.dataset.id,
          quantity: this.currentCart
        });
      }
      localStorage.setItem('totalCartValue', JSON.stringify(this.cartValue));
      if (localStorage.getItem('cartSize') == '0') {
        this.showUnit = false;
      }
    } else {
      this.showUnit = false;
    }

    console.log(JSON.parse(localStorage.getItem('totalCartValue')));
    // this.events.publish('updateCart');
  }

  buyNow(data) {
    console.log('buy now');
    
    if (this.cartSize > 0) {

      let navigationExtras: NavigationExtras = {
        state: {
          productDetail: this.productDetail
        }
      };
      this.router.navigate(['/payment-mode'], navigationExtras);
      
    } else {
      this.global.showMsg('Add quantity first for buy product');
    }
  }

  addToMyCart(data) {
    this.newCartAPI(data);
  }

  emptyFullCart(data) {

    let params = {
      user_id: this.currentUser.id,
    };

    this.apis.emptyCart(params).subscribe(
      (res: any) => {
        console.log(res);
        
        // localStorage.setItem('cartSize', res.cartData);
        // this.events.publish('updateCart');

        this.cartAPI(data);
      },
      (err: any) => {
        console.log(err);
        this.global.showMsg(err);
      }
    );
  }

  newCartAPI(data) {

    let _this = this;

    console.log('new cart api called');
    let proID = this.productDetail.id;

    this.proAttrID = '';

    let proPrice: any = '';

    //let proAttrID = '1';

    console.log(this.productDetail);
    // if (this.productDetail.product_attribute.attr.length == 0) {
      proPrice = this.productDetail.sale_price; //main product price
    // }
    // else {
    //   //set selected attr price
    //   let curr_el = this
    //   this.productDetail.product_attribute.attr.forEach(function (v, k) {
    //     if (curr_el.selectAttibute.attr_name.toString() === v.id.toString()) {
    //       proPrice = v.price; // attribute product price
    //       curr_el.proAttrID = curr_el.productAttributes.attr_name; // attribute product id
    //     }
    //   });
    // }

    console.log("testprice" + proPrice);


    let proQty = this.cartSize;
    console.log(this.cartSize);
    if (this.cartSize > 0) {

      let params = {
        user_id: this.currentUser.id,
        app_id: this.deviceID,
        app_type: this.currPlt,
        product_id: proID,
        product_attr_id: this.proAttrID,
        price: proPrice,
        qty: proQty,
      };

      this.apis.addToCart(params)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.status == '1') {
              this.lottieAnimeCart = true;
              localStorage.setItem('cartSize', res.count);
              // this.events.publish('updateCart');
              this.global.showMsg(res.msg);
              setTimeout(() => {
                this.lottieAnimeCart = false;
              }, 4000);
            }
            else if (res.status == '0') {
              //this.globalvar.presentInfoToast(res.msg);
              this.global.presentAlertConfirm(res.msg, function(err, success) {
                if(err) {
                  console.log('Cancel clicked');
                } else {
                  console.log('ohk clicked'); //Exit from app
                  _this.emptyFullCart(data);
                }
              })
            }

            //
          },
          (err: any) => {
            console.log(err);
            this.global.showMsg(err);
          }
        );
    } else {
      this.global.showMsg('Add some Unit for insert product in cart');
    }
  }

  cartAPI(data) {
    
    let _this = this;

    let proID = data.id;
    if (data.product_attribute[0] != undefined) {
      this.proAttrID = data.product_attribute[0].id;
    }
    //let proAttrID = '1';
    let proPrice = this.productDetail.sale_price;
    let proQty = this.cartSize;
    console.log(this.cartSize);
    if (this.cartSize > 0) {

      let params = {
        user_id: this.currentUser.id,
        app_id: this.deviceID,
        app_type: this.currPlt,
        product_id: proID,
        product_attr_id: this.proAttrID,
        price: proPrice,
        qty: proQty,
      };
      
      this.apis.addToCart(params)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.status == '1') {
              this.lottieAnimeCart = true;
              localStorage.setItem('cartSize', res.count);
              // this.events.publish('updateCart');
              setTimeout(() => {
                this.lottieAnimeCart = false;
              }, 4000);
            }
            if (res.status == '0') {
              this.global.presentAlertConfirm(res.msg, function(err, success) {
                if(err) {
                  console.log('Cancel clicked');
                } else {
                  console.log('ohk clicked');
                  _this.emptyFullCart(data);
                }
              })
            }

            //
          },
          (err: any) => {
            this.global.showMsg(err);
            console.log(err);
          }
        );
    } else {
      this.global.showMsg('Add some Unit for insert product in cart');
    }
  }

  IncreaseCart(data) {
    console.log(this.cartSize);
    if (this.productDetail.qty > this.cartSize) {
      this.cartSize += 1;
      localStorage.setItem('cartSize', this.cartSize);
      this.showUnit = true;
    } else {
      this.global.showMsg('Maximum Quantity Reached');
    }
  }

  DecreaseCart(data) {
    if (this.cartSize == 0) {
      //this.showUnit = false;
    } else {
      this.cartSize -= 1;
      localStorage.setItem('cartSize', this.cartSize);
      if (this.cartSize == 0) {
        this.showUnit = false;
      }
    }
  }

  addOrRemoveWishlist() {
    let appID = '1';
    let proID = this.productDetail.id;
    let proAttrID = '1';
    let proPrice = this.productDetail.sale_price;
    let proQty = 1;
    
    let params = {
      user_id: this.currentUser.id,
      app_id: appID,
      app_type: this.currPlt,
      product_id: proID,
      product_attr_id: proAttrID,
      price: proPrice,
      qty: proQty,
    };

    this.global.showloading();

    this.apis.addOrRemoveWishlist(params)
      .subscribe(
        (output: any) => {

          console.log(output);
          this.global.hideloading();

          if (output.status == '1') {
            this.global.showMsg(output.msg);
            localStorage.setItem('wishlistSize', output.count);
            // this.events.publish('updateCart');
            this.lottieAnime = true;
            this.heartRate = true;

            setTimeout(() => {
              this.lottieAnime = false;
            }, 2000);
          }
          else if (output.status == '2') {
            this.heartRate = false;
            this.global.showMsg(output.msg);
          }
        },
        (err: any) => {
          this.global.showMsg(err);
          this.global.showloading();
          console.log(err);
        }
      );
    // this.events.publish('updateCart');
  }

  onClickHeart(heart) {
    this.addOrRemoveWishlist();
  }

  viewPhoto(data, index) {
    console.log(index);
    
    // let modal = this.modalCtrl.create(GalleryModal, {
    //   photos: this.gallery_images,
    //   initialSlide: index
    // });
    // modal.present();
  }

}
