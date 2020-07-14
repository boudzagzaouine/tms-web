import { Action } from './action';
import { PeriodicityType } from './periodicity-type';
import { Responsability } from './responsability';
import { ServiceProvider } from './service-provider';
import { OperationType } from './operation-type';
import { ProgramType } from './program-type';
import { MaintenanceLine } from './maintenance-line';
import { Vehicle } from './vehicle';
import { MaintenanceType } from './maintenance-type';
import { MaintenanceState } from './maintenance-state';
import { Patrimony } from './patrimony';



export class MaintenancePlan {

  id = 0;
  code: string;
  description: string;
  startDate: Date = new Date();
  endDate: Date = new Date();
  maintenanceType: MaintenanceType;
  maintenanceState: MaintenanceState;
  programType: ProgramType;
  operationType: OperationType;
  serviceProvider: ServiceProvider;
  responsability: Responsability;
  service: Responsability;
  periodicityType: PeriodicityType;
  actions: Action[] = [];
  patrimony: Patrimony;
  mileage = 0.0;
  totalPrice = 0;
  agent: string;
  employer: string;
  alert: number;
  triggerDate: Date  = new Date();
  interventionDate: Date  = new Date();
  duration : number ;
  declaredDate : Date = new Date();
  observation : string;
  selectedTypes : []= [];
}
