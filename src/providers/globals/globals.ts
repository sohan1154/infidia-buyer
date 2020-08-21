import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController, ToastController, Platform } from '@ionic/angular';
import {Subject} from 'rxjs';

/*
  Generated class for the Global Provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public appName = 'Infidia Buyer';
  public appSortName = 'IB';
  public language: string = 'en';
  public role: string = 'Buyer';
  public footermsg: boolean = false;
  public networkStatus: boolean = true;
  public fmsg: string;
  public classcolor: string;
  public loading: any;
  private userSubject = new Subject<any>();
  public currentUser: any;
  public currency = 'INR';
  public appUrl = 'https://play.google.com/store/apps/details?id=io.infidia.buyer';
  
  constructor(
    public loadingCtrl: LoadingController,
    public plt: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) {

  }

  publishUserInfo(data: any) {
    this.userSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.userSubject;
  }
  
  async setCurrentUser(user: any) {
    this.currentUser = user;
  }

  setActiveMenus(pageKey) { 

  }

  async showMsg(error: any) {

    let message;

    if (typeof error === 'object')
      message = error.message;
    else
      message = error;

    const alert = await this.alertCtrl.create({
      // header: 'Alert',
      //subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showError(error: any) {

    let message;

    if (typeof error === 'object')
      message = error.message;
    else
      message = error;

    let alert = await this.alertCtrl.create({
      subHeader: 'Fail',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showCaution(error: any) {

    let message;

    if (typeof error === 'object')
      message = error.message;
    else
      message = error;

    let alert = await this.alertCtrl.create({
      subHeader: 'Caution',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(message, callback) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            callback(1, 0);
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            callback(0, 1);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal(ModalPage, params) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: params
    });
    
    return await modal.present();
  }

  async sortloader() {
    
    return await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 1000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }

  async showloading() {
    
    return await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 30000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }

  async showSortLoading() {
    
    return await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }

  async hideloading() {
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  // async presentTrueToast(msg) {
  //   let toast = await this.toastCtrl.create({
  //     message: msg,
  //     duration: 5000,
  //     cssClass: "trueToast",
  //     showCloseButton: true,
  //     closeButtonText: 'OK',
  //     position: 'bottom',
  //     dismissOnPageChange: false
  //   });

  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed true toast');
  //   });

  //   await toast.present();
  // }

  // presentFalseToast(msg) {
  //   let toast = await this.toastCtrl.create({
  //     message: msg,
  //     duration: 5000,
  //     cssClass: "falseToast",
  //     showCloseButton: true,
  //     closeButtonText: 'Cancel',
  //     position: 'bottom',
  //     dismissOnPageChange: false
  //   });

  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed false toast');
  //   });

  //   await toast.present();
  // }

  // presentInfoToast(msg) {
  //   let toast = await this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     cssClass: "infoToast",
  //     position: 'middle',
  //     dismissOnPageChange: false
  //   });

  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed info toast');
  //   });

  //   await toast.present();
  // }

  // public exitApp() {
  //   let alert = await this.alertCtrl.create({
  //     title: 'Confirm Exit',
  //     message: 'Are you sure you want to exit?',
  //     cssClass: 'myExitApp',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'OK',
  //         handler: () => {
  //           this.plt.exitApp(); //Exit from app
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  // public matchingPasswords(passwordKey, confirmPasswordKey) {
  //   return (group): { [key: string]: any } => {
  //     let password = group.controls[passwordKey];
  //     let confirmPassword = group.controls[confirmPasswordKey];

  //     if (password.value !== confirmPassword.value) {
  //       return {
  //         mismatchedPasswords: true
  //       };
  //     }
  //   }
  // }

}

