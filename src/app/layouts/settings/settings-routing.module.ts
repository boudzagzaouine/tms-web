import { SupplierComponent } from './supplier/supplier.component';
import { MaintenanceTypeComponent } from './maintenance-type/maintenance-type.component';
import { InsuranceTermComponent } from './insurance-term/insurance-term.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { BadgeTypeComponent } from './badge-type/badge-type.component';
import { BadgeComponent } from './badge/badge.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { MaintenanceStatusComponent } from './maintenance-status/maintenance-status.component';

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      { path: 'badges', component: BadgeComponent },
      { path: 'badge-types', component: BadgeTypeComponent },
      { path: 'suppliers', component: SupplierComponent },
      { path: 'contract-types', component: BadgeTypeComponent },
      { path: 'insurances', component: InsuranceComponent },
      { path: 'insurance-terms', component: InsuranceTermComponent },
      { path: 'maintenance-statuses', component: MaintenanceStatusComponent },
      { path: 'maintenance-types', component: MaintenanceTypeComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }