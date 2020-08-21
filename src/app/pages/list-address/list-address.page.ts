import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Generated class for the SelectAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-list-address',
  templateUrl: './list-address.page.html',
  styleUrls: ['./list-address.page.scss'],
})
export class ListAddressPage implements OnInit {

  currentUser: any;
  addresses: any = [];
  selectedAddress: any = {};

  constructor(
    private route: ActivatedRoute,
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {

    this.currentUser = this.global.currentUser;

    this.selectedAddress = JSON.parse(localStorage.getItem('selectedAddress'));

    this.loadData();
  }

  ngOnInit() {
    
  }

  loadData() {

    this.global.showloading();

    let params = {
      user_id: this.currentUser.id,
    }
    this.apis.fetchAddress(params).subscribe(
      (result: any) => {

        this.global.hideloading();
        console.log('result:', result);

        if (result.status == "1") {

          this.addresses = result.addresses;
        }
      },
      (err: any) => {
        this.global.showMsg(err);
        console.log(err);
      });
  }
  
  addNewAddress() {
    console.log('add new address')

    this.modalCtrl.dismiss({action: 'add-address'});
  }

  selectAddress(address) {
    console.log('select address:', address)

    this.selectedAddress = address;
    localStorage.setItem('selectedAddress', JSON.stringify(address));

    this.modalCtrl.dismiss({action: 'select-address', address: address});
  }

  editAddress(address) {
    console.log('edit address')
    this.modalCtrl.dismiss({action: 'edit-address', address});
  }

  deleteAddress(address_id, index) {

    let _this = this;

    this.global.presentAlertConfirm('Are you sure, you want to delete this address.', function(cancel, confirm) {

      if(cancel) {
        console.log('cancelled button called')
      }
      else if(confirm) {
        
        _this.global.showloading();
        console.log('confirm button called')

        let params = {
          user_id: _this.global.currentUser.id,
          id: address_id
        }
        _this.apis.removeAddress(params).subscribe(
          (result: any) => {
            
            _this.global.hideloading();
            console.log('result:', result);

            if (result.status == "1") {
    
              _this.addresses.splice(index, 1);
            } else {
              this.global.showMsg(result.msg);
            }
          },
          (err: any) => {
            _this.global.showMsg(err);
            console.error(err);
          });
      }
    })
  }

  isSelectedAddress(address_id) {

    if(this.selectedAddress != null && this.selectedAddress.id == address_id) {

      return true;
    } else {
      return false;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss('dismiss');
  }

}
