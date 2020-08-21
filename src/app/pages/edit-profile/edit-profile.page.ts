import { Component, ViewChild, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public currentUser: any = {};
  editProfileForm: FormGroup;

  constructor(
    public global: GlobalProvider,
    private storage: Storage,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public apis: ApisService
  ) {

    this.currentUser = this.global.currentUser;

    this.editProfileForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobile: [''],
    });

  }

  ngOnInit() {

  }

  updateProfile() {

    this.global.showloading();

    let params = {
      user_id: this.currentUser.id,
      name: this.editProfileForm.value.name,
      email: this.editProfileForm.value.email,
    };
    this.apis.updateProfile(params)
      .subscribe((result: any) => {

        console.log('result:', result);
        this.global.hideloading();

        // set user information
        this.storage.set('user', result.userDetails);

        // set user information 
        this.global.setCurrentUser(result.userDetails);

        // update Observable 
        this.global.publishUserInfo(result.userDetails);

        this.global.showMsg(result.msg);
      },
        error => {
          console.error(error.msg);
          this.global.hideloading();
          this.global.showMsg(error);
        });
  }

}

