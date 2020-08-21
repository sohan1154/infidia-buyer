import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { File } from '@ionic-native/file/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  currentUser: any = {};
  orderID: any;
  orderDetails: any;
  orderProducts: any;
  returnableProducts: any = [];
  full_blank = '../../assets/img/full_blank.jpg';
  oneFill = '../../assets/img/one_fil.jpg';
  fill_second = '../../assets/img/fill_second.jpg';
  third_fil = '../../assets/img/third_fil.jpg';
  full_fill = '../../assets/img/full_fill.jpg';
  currPlt: any;
  pdfObj = null;
  letterObj = {
    to: 'Guest',
    from: 'Jaipur',
    text: 'Simply dummy text.'
  }

  constructor(
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public apis: ApisService,
    private file: File,
    private platform: Platform,
    // private fileOpener: FileOpener,
  ) {
    this.orderID = this.activatedRoute.snapshot.paramMap.get('order_id');
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.currentUser = this.global.currentUser;

    this.getorderDetails();
  }

  getorderDetails() {

    this.global.showSortLoading();

    let params = {
      user_id: this.currentUser.id,
      id: this.orderID
    };

    this.apis.getOrderDetail(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.orderDetails = result.orderDetails;
          this.orderProducts = result.orderDetails.product_details;
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

  increaseQty(productID, returnableQty) {

    if (typeof this.returnableProducts['product_id_' + productID] === 'undefined') {
      this.returnableProducts['product_id_' + productID] = 1;
    }
    else if (returnableQty < 1) {
      this.global.showMsg('Product is already returned');
    }
    else if (returnableQty > this.returnableProducts['product_id_' + productID]) {
      this.returnableProducts['product_id_' + productID] += 1;
    }
    else {
      this.global.showMsg('Maximum Available Quantity Reached');
    }

    console.log(this.returnableProducts);
  }

  decreaseQty(productID) {
    if (typeof this.returnableProducts['product_id_' + productID] === 'undefined') {
      this.returnableProducts['product_id_' + productID] = 0;
    }
    else if (this.returnableProducts['product_id_' + productID] > 0) {
      this.returnableProducts['product_id_' + productID] -= 1;
    }

    console.log(this.returnableProducts);
  }

  displayReturnableProductCount(productID) {
    if (typeof this.returnableProducts['product_id_' + productID] !== 'undefined') {
      return this.returnableProducts['product_id_' + productID];
    } else {
      return 0;
    }
  }

  returnItem(productID) {
    let orderID = this.orderDetails.id;
    let qty = 0;

    if (typeof this.returnableProducts['product_id_' + productID] === 'undefined' || this.returnableProducts['product_id_' + productID] == 0) {
      this.global.showMsg('Please set product quantity first.');
      return false;
    } else {
      qty = this.returnableProducts['product_id_' + productID];
    }

    this.global.showloading();

    let params = {
      id: orderID,
      product_id: productID,
      qty: qty,
    }

    this.apis.returnProduct(params).subscribe(
      (response: any) => {
        
        this.global.hideloading();
        console.log(response);

        if (response.status == "1") {

          this.global.showMsg(response.msg);

          // update complete order-detail object
          this.orderDetails = response.orderData;
          this.orderProducts = this.orderDetails.product_details;

          this.returnableProducts = []; // reset updated value for to be return product

        } else {
          this.global.showMsg(response.msg);
        }
      },
      (err: any) => {
        this.global.hideloading();
        this.global.showMsg(err);
        console.log(err);
      });
  }

  cancelOrder() {

    let _this = this;
    
    let resMsg = "Are you sure to cancel this order?"

    this.global.presentAlertConfirm(resMsg, function(err, success) {
      if(err) {
        console.log('Cancel clicked');
      } else {
        console.log('ohk clicked');
        
        let params = {
          id: _this.orderDetails.id,
        }
    
        _this.global.showloading();
    
        _this.apis.cancelOrder(params).subscribe(
          (response: any) => {
    
            _this.global.hideloading();
            console.log(response);
    
            _this.global.showMsg(response.msg);
            if (response.status == "1") {
              _this.orderDetails.is_cancelled = 1;
              _this.orderDetails.order_status = 'Cancelled';
            } else {
              
            }
          },
          (err: any) => {
            _this.global.hideloading();
            _this.global.showMsg(err);
            console.log(err);
          });
      }
    })
  }

  gotoProduct(product) {
    this.navCtrl.navigateForward(['/product-detail/', product.id]);
  }

  createPdf() {
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  // downloadPdf() {

  //   this.global.showMsg('11111111111');

  //   if (this.platform.is('android')) {
  //     this.currPlt = 'android';
  //   }
  //   if (this.platform.is('ios')) {
  //     this.currPlt = 'ios';
  //   }
  //   if (this.platform.is('cordova')) {
  //     this.currPlt = 'browser';
  //   }

  //   this.global.showMsg('222222222222');

  //   if (this.currPlt == 'android' || this.currPlt == 'ios' || this.currPlt == 'device') {

  //     this.global.showMsg('333333333333333333');

  //     this.pdfObj.getBuffer((buffer) => {

  //       this.global.showMsg('4444444444444444444');

  //       var blob = new Blob([buffer], { type: 'application/pdf' });

  //       this.global.showMsg('555555555555555555');

  //       // Save the PDF to the data Directory of our App
  //       this.file.writeFile(this.file.dataDirectory, 'order-invoice.pdf', blob, { replace: true }).then(fileEntry => {

  //         this.global.showMsg('666666666666666666');

  //         this.global.showMsg(this.file.dataDirectory + 'order-invoice.pdf');

  //         // Open the PDf with the correct OS tools
  //         this.fileOpener.open(this.file.dataDirectory + 'order-invoice.pdf', 'application/pdf');

  //         this.global.showMsg('777777777777777777777777');

  //       })
  //     });
  //   } else {
  //     this.global.showMsg('000000000000000');
  //     // On a browser simply use download!
  //     this.pdfObj.download();
  //   }
  // }

}
