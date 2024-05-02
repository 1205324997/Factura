import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SimplebarAngularModule } from 'simplebar-angular';

import { DefaultComponent } from './default/default.component';
import { VoucherComponent } from 'src/app/pages/dashboards/voucher/voucher.component';
import { CreditnotesComponent } from './creditnotes/creditnotes.component';
import { DebitnotesComponent } from './debitnotes/debitnotes.component';
import { LiquidationComponent } from './liquidation/liquidation.component';
import { WithholdingComponent } from './withholding/withholding.component';
import { GuideComponent } from './guide/guide.component';

@NgModule({
  declarations: [DefaultComponent, VoucherComponent, CreditnotesComponent, DebitnotesComponent, LiquidationComponent, WithholdingComponent, GuideComponent], 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot()
  ],
  providers: [BsDropdownConfig],
})
export class DashboardsModule { }
