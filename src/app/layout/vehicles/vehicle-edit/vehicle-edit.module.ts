import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { VehicleEditComponent } from './vehicle-edit.component';
import { CategoryComponent } from '../category/category.component';
import { VehicleEditRoutingModule } from './vehicle-edit-routing.module';
import { TrafficEditComponent } from "../traffic-edit/traffic-edit.component";

@NgModule({
    imports: [
        CommonModule,
        VehicleEditRoutingModule,
        PageHeaderModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        NgbModule,
       
        //NgModule
    ],
    declarations: [VehicleEditComponent, TrafficEditComponent],
    entryComponents: [TrafficEditComponent]
})
export class VehicleEditModule {}
