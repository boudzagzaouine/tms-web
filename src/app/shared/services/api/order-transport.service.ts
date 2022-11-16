import { TypeInfo } from './../../enum/type-info.enum';
import { OrderTransportInfo } from './../../models/order-transport-info';
import { OrderTransport } from './../../models/order-transport';
import { Transport } from './../../models/transport';
import { PackagingType } from './../../models/packaging-type';
import { PackageDetail } from './../../models/package-detail';
import { Subject } from 'rxjs';

import { EmsService } from './ems.service';
import {Injectable} from '@angular/core';
import { ProxyService } from './proxy.service';
import { Account } from '../../models';

@Injectable()
export class OrderTransportService  extends EmsService<OrderTransport> {


  orderdeliver  = new Subject<OrderTransport>();
  selectOrderTransport :OrderTransport=new OrderTransport();
  activeIndex = new Subject<number>();
  index : number=0;

  constructor(proxy: ProxyService) {
    super(proxy, 'orderTransports');
  }

  emitOnchange(){
    this.orderdeliver.next(this.selectOrderTransport);
  }

cloneOrderTransport(OrderTransport : OrderTransport){

this.selectOrderTransport=OrderTransport;
   this.emitOnchange();
}
clearObject(){
  this.selectOrderTransport=new OrderTransport();
this.emitOnchange();}

  addOrder(OrderTransport : OrderTransport){

    this.selectOrderTransport.code=OrderTransport.code;
    this.selectOrderTransport.date=OrderTransport.date;
    this.selectOrderTransport.loadingType=OrderTransport.loadingType;
    this.selectOrderTransport.turnType=OrderTransport.turnType;
    this.selectOrderTransport.account=OrderTransport.account;
    this.selectOrderTransport.turnStatus=OrderTransport.turnStatus;
    this.selectOrderTransport.vehicleCategory=OrderTransport.vehicleCategory;
    this.selectOrderTransport.weightTotal=OrderTransport.weightTotal;
    this.selectOrderTransport.capacityTotal=OrderTransport.capacityTotal;

   this.emitOnchange();


  }

  getOrderTransport(){
    return this.selectOrderTransport ?this.selectOrderTransport: new OrderTransport();
  }

  getOrderTransportCode(){
    return this.selectOrderTransport.code;

  }
  addPrice(price : number){
    this.selectOrderTransport.priceTTC=price;
    this.emitOnchange();

  }

  addOrderTransportInfoAller(orderTransportInfo :OrderTransportInfo){

    this.selectOrderTransport.orderTransportInfoAller=orderTransportInfo;
    this.selectOrderTransport.orderTransportInfoAller.type=TypeInfo.Aller.toString();
    this.emitOnchange();

  }

  addOrderTransportInfoRetour(orderTransportInfo :OrderTransportInfo){

    this.selectOrderTransport.orderTransportInfoRetour=orderTransportInfo;
    this.selectOrderTransport.orderTransportInfoRetour.type=TypeInfo.Retour.toString();

    this.emitOnchange();

  }

  getorderTransportInfoAller(){
    if( this.selectOrderTransport?.orderTransportInfoAller!=null){
      if( this.selectOrderTransport?.orderTransportInfoAller?.orderTransportInfoLines!=null){
    this.selectOrderTransport.orderTransportInfoAller.orderTransportInfoLines.sort(function (a, b) {
      return Number(a.lineNumber) - Number(b.lineNumber);
    });}}
    else {
      this.selectOrderTransport.orderTransportInfoAller= new OrderTransportInfo();
    }
    return this.selectOrderTransport.orderTransportInfoAller ;
  }

  getorderTransportInfoRetour(){
    if( this.selectOrderTransport?.orderTransportInfoRetour!=null){
      if( this.selectOrderTransport?.orderTransportInfoRetour?.orderTransportInfoLines!=null){
    this.selectOrderTransport.orderTransportInfoRetour.orderTransportInfoLines.sort(function (a, b) {
      return Number(a.lineNumber) - Number(b.lineNumber);
    });}}
    else {
      this.selectOrderTransport.orderTransportInfoRetour= new OrderTransportInfo();
    }
    return this.selectOrderTransport.orderTransportInfoRetour ;
  }





  addPriceAller(price :number){
      this.selectOrderTransport.orderTransportInfoAller.priceTTC += price;
       }
       addPriceRetour(price : number){
        this.selectOrderTransport.orderTransportInfoRetour.priceTTC += price;


       }
       soustPriceAller(price :number){
        this.selectOrderTransport.orderTransportInfoAller.priceTTC -= price;
         }
         soustPriceRetour(price : number){
          this.selectOrderTransport.orderTransportInfoRetour.priceTTC -= price;

         }




}