import { Component, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../providers/globals/globals";
import { ApisService } from "../../../providers/apis/apis";
import { Storage } from '@ionic/storage';

import { NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.page.html',
  styleUrls: ['./static-page.page.scss'],
})
export class StaticPagePage implements OnInit {

  pageDetail: any = {};
  slug: string = '';

  constructor(
    public global: GlobalProvider,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public apis: ApisService
  ) {

    console.log('activatedRoute:', this.activatedRoute.snapshot.paramMap)
    this.slug = this.activatedRoute.snapshot.paramMap.get('page_slug');
    this.getStaticPage();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  getStaticPage() {
    this.global.showSortLoading();

    this.apis.staticPage({ slug: this.slug })
      .subscribe((result: any) => {
        
        console.log('result:', result);
        
        this.global.hideloading();
        this.pageDetail = result.page_data;
      },
        error => {
          console.error(error.message);
          this.global.hideloading();
          this.global.showMsg(error);
        });
  }

}

