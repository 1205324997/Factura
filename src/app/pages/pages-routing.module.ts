import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { VoucherComponent } from './dashboards/voucher/voucher.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'voucher', component: VoucherComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }