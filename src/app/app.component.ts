import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

import { GlobalProvider } from "../providers/globals/globals";
import { ApisService } from "../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public global: GlobalProvider,
    private storage: Storage,
    public apis: ApisService,
    // private uniqueDeviceID: UniqueDeviceID,
    public navCtrl: NavController
  ) {

    this.initializeApp();
  }

  initializeApp() {
    
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.isLoggedIn();
    });
  }

  isLoggedIn() {

    // get user information 
    this.storage.get('user').then((user) => {

      console.log('##################### user:', user);

      if (user) {
        // set user information 
        this.global.setCurrentUser(user);

        // this.navCtrl.navigateRoot('/');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
      
      this.getUniqueDeviceID();
    });
  }

  getUniqueDeviceID() {
    // this.uniqueDeviceID.get()
    //   .then((UDID: any) => {
    //     console.log("===UDID==", UDID);
    //     this.storage.set('UDID', UDID);
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //   });
  }

}

