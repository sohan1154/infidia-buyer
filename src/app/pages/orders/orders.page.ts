import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the PastOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  currentUser: any;
  orders: any = [];

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
    
    this.getOrders();
  }

  ionViewWillEnter() {
    
  }

  getOrders() {

    let params = {
      user_id: this.currentUser.id
    };

    this.global.showloading();

    this.apis.PastOrderDetails(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        if (result.status == '1') {
          this.orders = result.orderDetails;
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
  
  gotoOrderDetail(order_id){
    this.navCtrl.navigateForward(['/order-detail/', order_id]);
  }

}
