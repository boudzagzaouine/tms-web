import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { InsuranceComponent } from './insurance.component';
import { InsuranceEditComponent } from './insurance-edit/insurance-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [InsuranceComponent, InsuranceEditComponent],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    TableModule,
    InputTextModule,
    NgbModule,
    CalendarModule,
    DropdownModule
  ]
})
export class InsuranceModule { }