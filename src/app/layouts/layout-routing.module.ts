import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      { path: 'vehicles', loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule) },
      { path: 'drivers', loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule) },
      { path: 'consomptions',
       loadChildren: () => import('./commission-driver/commission-driver.module')
       .then(m => m.CommissionDriverModule) },
      // { path: 'insurances', loadChildren: () => import('./insurance/insurance.module').then(m => m.InsuranceModule) },

    
      { path: 'turn', loadChildren: () => import('./turn/turn.module').then(m => m.TurnModule) },
      { path: 'machine', loadChildren: () => import('./machine/machine.module').then(m => m.MachineModule) },

      {
        path: 'maintenance',
        loadChildren: () => import('./maintenance/maintenance.module')
          .then(m => m.MaintenanceModule)
      },
      {
        path: 'maintenance-plan',
        loadChildren: () => import('./maintenance-preventive/maintenance-preventive.module')
          .then(m => m.MaintenancePreventiveModule)
      },

      { path: 'stock',
       loadChildren: () => import('./stock/stock.module').then(m => m.StockModule) },

       { path: 'order',
       loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },

       { path: 'reception',
       loadChildren: () => import('./reception/reception.module').then(m => m.ReceptionModule) },

       
  
    ],
  }];

@NgModule({
  declarations: [

  ],
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
  ]
})

export class AppLayoutRoutingModule { }
