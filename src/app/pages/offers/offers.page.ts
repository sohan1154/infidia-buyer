import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gotoOfferDetailPage() {
    console.log('offer detail page button is clicked.')
  }

}
