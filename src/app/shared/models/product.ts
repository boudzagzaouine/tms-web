import { ServiceType } from './service-type';
import {Vat} from './vat';
import {Owner} from './owner';
import {Uom} from './uom';
import {ProductType} from './product-type';
//import {Image} from './image';
import {ProductPack} from './product-pack';
import {BoundNodeCallbackObservable} from 'rxjs/observable/BoundNodeCallbackObservable';
import {Currency} from './currency';
import { Image } from 'exceljs';

export class Product {

  id: number;
  code: string;
  desc: string;
  shortDesc: string;
  discount: number;
  salePriceUB: number;
  purshasePriceUB: number;
  vat: Vat;
  purchaseVat: Vat;
  outOfStock: boolean;
  active: boolean;
  isKit: boolean;
  creationDate: Date;
  updateDate: Date;
  images: Image[] = [];
  uomByProductUomBase: Uom;
  uomByProductUomSale: Uom;
  uomByProductUomPurshase: Uom;
  owner: Owner;
  productType: ProductType;
  stockQuantity: number;
  reservedQuantity: number;
  blockedQuant0ity: number;
  orderedQuantity: number;
  productPack: ProductPack;
  stocked: boolean;
  stockManaged: boolean;
  supplierDelay: number;
  purshasePriceTTCUB: number;
  minStock: number;
  component:Boolean=false;
  serviceType:ServiceType;
  service:Boolean=false;


    constructor() {
    }
}
