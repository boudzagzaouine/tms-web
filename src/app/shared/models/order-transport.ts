import { TransportPlanServiceCatalog } from './transport-plan-service-catalog';
import { MarchandiseType } from './marchandise-type';
import { Trajet } from './trajet';
import { Contact } from './contact';
import { VehicleTray } from './vehicle-tray';
import { Company } from './company';
import { OrderTransportInfo } from './order-transport-info';
import { VehicleCategory } from './vehicle-category';
import { Vehicle } from './vehicle';
import { TurnTransport } from './turn-transport';
import { PackagingType } from './packaging-type';
import { TurnStatus } from './turn-status';
import { PackageDetail } from './package-detail';
import { Account } from './account';
import { TurnType } from './turn-Type';
import { LoadingType } from './loading-type';
import { ActionTypeRepair } from './action-type-repair';
import { Owner } from './owner';
import { Vat } from './vat';


export class OrderTransport {

  id: number;
  code: string;
  date:Date = new Date();
  turnType:TurnType; // aller-retour
  loadingType:LoadingType; // complet
  packagingType: PackagingType;
  consignment:Boolean;
  port:string ; // payé true , du false
  palletResponsibility:string ; //true prestataire /false client
  marchandiseType:MarchandiseType;
  account :Account;
  contact:Contact;
  turnStatus:TurnStatus;
  vehicleCategory :VehicleCategory ;
  vehicleTray:VehicleTray;
  trajet:Trajet;
  orderTransportInfoAller:OrderTransportInfo;
  remark : string;
  weightTotal: number = 0;
  capacityTotal: number = 0;
  priceHT: number = 0;
  vat :Vat;
  priceTTC:number;
  priceVat:number;
  totalPriceHT:number;
  totalPriceTTC:number;
  totalPriceVat:number;

  marginRate:number=0;
  marginValue : number=0;
  owner :Owner;
  orderTransportServiceCatalogs : TransportPlanServiceCatalog[]=[];
  index :  boolean ; // variable local
}
