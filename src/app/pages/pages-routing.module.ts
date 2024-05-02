import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { VoucherComponent } from './dashboards/voucher/voucher.component';
import { CreditnotesComponent } from './dashboards/creditnotes/creditnotes.component';
import { DebitnotesComponent } from './dashboards/debitnotes/debitnotes.component';
import { LiquidationComponent } from './dashboards/liquidation/liquidation.component';
import { WithholdingComponent } from './dashboards/withholding/withholding.component';
import { GuideComponent } from './dashboards/guide/guide.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'voucher', component: VoucherComponent },
  { path: 'creditNotes', component:  CreditnotesComponent},
  { path: 'debitNotes', component:  DebitnotesComponent},
  { path: 'liquidation', component:  LiquidationComponent},
  { path: 'withholding', component:  WithholdingComponent},
  { path: 'guide', component:  GuideComponent},
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
