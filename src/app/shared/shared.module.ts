
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import {
  BadgeTypeService,
  BadgeService,
  ContractTypeService,
  InsuranceTermService,
  InsuranceService,
  MaintenancePlanService,
  MaintenanceStateService,
  MaintenanceTypeService,
  SupplierService,
  VehicleCategoryService,
  VehicleService
 } from './services';
import { DriverService } from 'selenium-webdriver/remote';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        BadgeTypeService,
        BadgeService,
        ContractTypeService,
        DriverService,
        InsuranceTermService,
        InsuranceService,
        MaintenancePlanService,
        MaintenanceStateService,
        MaintenanceTypeService,
        SupplierService,
        VehicleCategoryService,
        VehicleService
        ]
    };
  }
}
