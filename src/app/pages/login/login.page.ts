import { Component, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import {NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  loginform:FormGroup;
  regCre = { phoneNumber: ''};

  constructor(
    public global: GlobalProvider,
    private storage: Storage,
    public apis: ApisService,
    private formBuilder: FormBuilder,
    public navCtrl: NavController
  ) {
    
  }

  ngOnInit() {
    
    this.loginform = this.formBuilder.group({
      phoneNumber: ['', Validators.compose([Validators.pattern('[0-9+]*'),Validators.minLength(10),Validators.required])],   
    });
  }

  login(form: NgForm) {
    
    let mobile = this.loginform.value.phoneNumber;

    this.global.showloading();
    
    this.apis.sendOTP({ mobile: mobile, role: this.global.role })
      .subscribe((result: any) => {

        console.log('result:', result);
        
        this.global.hideloading();

        if (result.status) {
          
          this.storage.set('mobile', mobile);
          this.navCtrl.navigateForward('/otp');
        } else {
          this.global.showMsg(result.message);
        }
      },
        error => {
          console.error(error.message);
          this.global.hideloading();
          this.global.showMsg(error);
        });
  }

  staticPages(pageKey) {
    this.navCtrl.navigateForward('/static-page/'+pageKey);
  }

}
