import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {

  message: any = {};

  constructor(
    public global: GlobalProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public apis: ApisService,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {

    this.message = {
      title: 'Thank You',
      text: 'Thank you for shopping with us.',
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {

    console.log('ionViewWillEnter is called')

    setTimeout(() => {
      this.navCtrl.navigateForward('home');
     }, 3500);
  }

}
