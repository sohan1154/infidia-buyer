import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GlobalProvider } from "../../../../providers/globals/globals";
import { ApisService } from "../../../../providers/apis/apis";
import { Storage } from '@ionic/storage';
import { NgForm, Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Platform, NavController, NavParams, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps, GoogleMap, Environment, GoogleMapOptions, GoogleMapsEvent, Marker } from "@ionic-native/google-maps/ngx";

/**
* Generated class for the AddAddressPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google: any;

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  currentUser: any;
  lat: any = '';
  lng: any = '';
  type: any = 'Home';
  address: any = {}
  userAddr = { location: '', house: '', address: '', pincode: '' };
  public lottieConfig: Object;
  public anim: any;
  activeClass = 'active md hydrated';
  normalClass = 'md hydrated';

  addAddressForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public plt: Platform,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public navParams: NavParams,
    private route: ActivatedRoute,
    public global: GlobalProvider,
    private storage: Storage,
    public apis: ApisService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {

    this.plt.ready().then(() => {

      this.route.paramMap.subscribe(paramMap => {
        console.log('address:', this.address)

        this.type = this.address.type;

        this.lat = this.address.latitude;
        this.lng = this.address.longitude;
      });

      this.addAddressForm = formBuilder.group({

        location: ['', Validators.compose([Validators.required])],
        house_no: ['', Validators.compose([ Validators.required])],
        address : ['', Validators.compose([Validators.required])],
        pincode : ['', Validators.compose([Validators.required])],
        latitude : ['', Validators.compose([Validators.required])],
        longitude : ['', Validators.compose([Validators.required])],
      });

      // get user current location
      // this.getGeolocation();

      setTimeout(()=>{
        this.loadMap();
        //AIzaSyCeAEzbdCaoMF6zjn5EFoQHbkO6tkGut5o
      },3000);

    });
  }

  ngOnInit() {

    this.currentUser = this.global.currentUser;

    this.getAddress();
  }

  loadMap() {
    
    console.log('load-map function')

    let latLng = new google.maps.LatLng(this.lat, this.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    console.log('this.mapElement.nativeElement:', this.mapElement.nativeElement)
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker();
  }

  addMarker() {
    
    console.log('add-marker function')

    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "Location";

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    
    console.log('add-info-window function')

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'dragend', (event) => {
      console.log('avb');
      console.log('event:::::', event)
      console.log('lat: ' + event.latLng.lat());
      console.log('lng: ' + event.latLng.lng());
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
      this.getAddress();
    });

  }

  async presentActionAlertBox(message, callback) {
    const alert = await this.alertCtrl.create({
      // header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Continue with this address',
          cssClass: 'primery',
          handler: (blah) => {
            callback(0, 'continue-order');
          }
        },
        {
          text: 'Add new address',
          cssClass: 'secondary',
          handler: () => {
            callback(0, 'add-new-address');
          }
        },
        {
          text: 'Select from exiting',
          cssClass: 'danger',
          handler: () => {
            callback(0, 'list-addresses-page');
          }
        },
      ]
    });

    await alert.present();
  }

  saveAddress() {

    let _this = this;
    
    console.log('save-address function')

    this.global.showloading();

    let params = {
      id: this.address.id, // only in update address case
      user_id: this.currentUser.id,
      type: this.type,
      location: this.addAddressForm.value.location,
      house_no: this.addAddressForm.value.house_no,
      address: this.addAddressForm.value.address,
      landmark: this.addAddressForm.value.pincode,
      latitude: this.lat,
      longitude: this.lng,
    };
    console.log('params:', params)

    this.apis.addAddress(params).subscribe(
      (response: any) => {

        console.log('response:', response);
        this.global.hideloading();

        if (response.status == "1") {

          this.presentActionAlertBox('Please section further action.', function(error, result) {

            if(error) {
              console.error(error)
            }
            else if(result == 'continue-order') {

              localStorage.setItem('selectedAddress', JSON.stringify(response.addresses));

              _this.modalCtrl.dismiss('dismiss');
            }
            else if(result == 'add-new-address') {
              _this.addAddressForm.reset()
            }
            else if(result == 'list-addresses-page') {
              _this.modalCtrl.dismiss({action: 'list-address'});
            }
          })
        }
      },
      (err: any) => {
        this.global.hideloading();
        console.error(err);
        this.global.showMsg(err);
      });
  }

  selectAddressType(type) {
    console.log('address-type:', type);

    this.type = type;
  }

  getGeolocation() {
    
    console.log("getGeolocation is called::::");

    this.geolocation.getCurrentPosition().then((resp) => {

      console.log('resp::::::', resp);

      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      console.log('latitude::::::', this.lat);
      console.log('longitude::::::', this.lng);

      this.getAddress();

    }).catch((error) => {
      console.error(JSON.stringify(error));
      // alert('Error getting location' + JSON.stringify(error));
    });
  }

  getAddress() {
    console.log('get-address function')
    console.log('lat:', this.lat);
    console.log('lng:', this.lng);

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(this.lat, this.lng, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log('result:', JSON.stringify(result[0]));

        let res = result[0];
        this.getMylocation(res);
        this.getMyAddress(res);
        this.getHouseNo(res);
        this.getPincode(res);
      })
      .catch((error: any) => {
        console.error(error);
        this.global.showMsg(error);
      });
  }

  getPincode(res) {

    console.log('get-pincode function')

    let fullAddress: string = '';
    if (res.postalCode) {
      fullAddress = res.postalCode;
    }
    this.userAddr.pincode = fullAddress;
  }

  getHouseNo(res) {
    
    console.log('get-house-no function')

    let fullAddress: string = '';
    if (res.subThoroughfare) {
      fullAddress = res.subThoroughfare;
    }
    this.userAddr.house = fullAddress;
  }

  getMyAddress(res) {
    
    console.log('getMyAddress-res function:', res);
    
    let fullAddress: string = '';
    if (res.thoroughfare) {
      fullAddress += ', ' + res.thoroughfare;

    }
    if (res.subLocality) {
      fullAddress += ', ' + res.subLocality;
    }

    let value = fullAddress.replace(', ', '');
    this.userAddr.address = value;
  }

  getMylocation(res) {
    
    console.log('getMylocation-res function:', res);
    
    let fullAddress: string = '';
    if (res.subThoroughfare) {
      fullAddress = ', ' + res.subThoroughfare;
    }

    if (res.thoroughfare) {
      fullAddress += ', ' + res.thoroughfare;

    }
    if (res.subLocality) {
      fullAddress += ', ' + res.subLocality;
    }
    if (res.locality) {
      fullAddress += ', ' + res.locality;
    }
    if (res.countryName) {
      fullAddress += ', ' + res.countryName;
    }

    let value = fullAddress.replace(', ', '');

    this.userAddr.location = value;
  }

  dismiss() {
    this.modalCtrl.dismiss({action: 'list-address'});
  }

}

