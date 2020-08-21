import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAddressPageRoutingModule } from './list-address-routing.module';

import { ListAddressPage } from './list-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAddressPageRoutingModule
  ],
  declarations: [ListAddressPage]
})
export class ListAddressPageModule {}
