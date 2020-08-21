import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAddressPage } from './list-address.page';

const routes: Routes = [
  {
    path: '',
    component: ListAddressPage
  },
  {
    path: 'add-address',
    loadChildren: () => import('./add-address/add-address.module').then( m => m.AddAddressPageModule)
  },
  {
    path: 'edit-address/:address',
    loadChildren: () => import('./edit-address/edit-address.module').then( m => m.EditAddressPageModule)
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./edit-address/edit-address.module').then( m => m.EditAddressPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAddressPageRoutingModule {}
