import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentModeFromCartPageRoutingModule } from './payment-mode-from-cart-routing.module';

import { PaymentModeFromCartPage } from './payment-mode-from-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentModeFromCartPageRoutingModule
  ],
  declarations: [PaymentModeFromCartPage]
})
export class PaymentModeFromCartPageModule {}
