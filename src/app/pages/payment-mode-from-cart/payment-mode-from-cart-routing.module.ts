import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentModeFromCartPage } from './payment-mode-from-cart.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentModeFromCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentModeFromCartPageRoutingModule {}
