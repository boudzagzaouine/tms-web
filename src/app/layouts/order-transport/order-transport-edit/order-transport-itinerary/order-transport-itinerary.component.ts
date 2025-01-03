import { OrderTransportService } from './../../../../shared/services/api/order-transport.service';
import { itineraryInfo } from './../../../../shared/models/itineraryInfo';
import { Marker, Icon,icon } from 'leaflet';
import { OrderTransportInfoLine } from './../../../../shared/models/order-transport-info-line';
import { Itinerary } from './../../../../shared/models/Itinerairy';

import { Component, OnInit, Output, EventEmitter, Input, enableProdMode } from '@angular/core';
import  * as L  from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-order-transport-itinerary',
  templateUrl: './order-transport-itinerary.component.html',
  styleUrls: ['./order-transport-itinerary.component.scss']
})
export class OrderTransportItineraryComponent implements OnInit {

  @Output() showDialog = new EventEmitter<boolean>();
  //@Output() distance1 = new EventEmitter<string>();
  @Output() itineraryInfo = new EventEmitter<itineraryInfo>();
  @Input () orderTransportInfoLignes: Array<OrderTransportInfoLine> = [];
   selectItineraryInfo :itineraryInfo = new itineraryInfo();
  displayDialog: boolean;
  itinerary :Itinerary= new Itinerary();
  itineraries : Array<Itinerary>=[];
  map:any;
  mainLayer:any;

 distance:any;
  time:string;
  heur :any ;
  minute : any ;


 private iconEnlevement: Icon = icon({
   iconUrl: "./assets/img/enlevement.png",
      iconSize:    [40, 40],
 });
 private iconEnlevementLivraison: Icon = icon({
  iconUrl: "./assets/img/EnlLiv.png",
     iconSize:    [40, 40],
});
 private iconLivraison: Icon = icon({
   iconUrl: "./assets/img/livraison.png",
      iconSize:    [40, 40],
 });

 display: boolean = false;
  constructor(private orderTransportService: OrderTransportService) { }


  ngOnInit() {
    this.displayDialog = true;

    // this.itinerary= new Itinerary();
    // this.itinerary.lat=this.orderTransportInfoLignes[0].addressContactDeliveryInfo.latitude;
    // this.itinerary.lon=this.orderTransportInfoLignes[0].addressContactDeliveryInfo.longitude;
    // this.itinerary.description="depot";
    // this.itinerary.type="depot";
    // this.itineraries.push(this.itinerary);



    this.orderTransportInfoLignes.forEach(ligne => {
     this.itinerary= new Itinerary();
     this.itinerary.lat= ligne.address.latitude;
     this.itinerary.lon=ligne.address.longitude;
     this.itinerary.description=ligne.address.code;
     this.itinerary.type=ligne.orderTransportType.code;

     this.itineraries.push(this.itinerary);
    });

 }

 ngAfterViewInit(){
  Marker.prototype.options.icon = this.iconEnlevement;
  this.createLayer();
    this.createRoute();


 }



 createRoute() {
   const  dis = null;
   var split_route1:L.LatLng[]=[];

 this.itineraries.forEach(element => {
          split_route1.push(new L.LatLng(element.lat ,  element.lon,0 ));
 });

  var route= L.Routing.control({
     routeWhileDragging: true,
     addWaypoints: false,

     waypoints: split_route1,

 }).on('routesfound',(e)=>{
   console.log(e);
 this.distance=e.routes[0].summary.totalDistance/1000 as number;
 console.log(e.routes[0].summary.totalTime);

 this.time= (e.routes[0].summary.totalTime/3600).toString();
 this.heur=  this.time.split('.',2)[0];
 this.minute=this.time.split('.',2)[1].substring(0,2);

this.orderTransportService.addItineraryAller(this.distance,e.routes[0].summary.totalTime);
console.log( this.orderTransportService.getItineraryAller());

 this.selectItineraryInfo.distance=this.distance;
 this.selectItineraryInfo.heur=this.heur;
 this.selectItineraryInfo.minute=this.minute;
 this.selectItineraryInfo.time=this.time;
 this.itineraryInfo.emit(this.selectItineraryInfo);

 new Date()
 }
 ).addTo(this.map).hide();


 for (var i in this.itineraries) {
   L.marker(L.latLng(this.itineraries[i].lat, this.itineraries[i].lon), {
     title: this.itineraries[i].description,
     //icon: this.itineraries[i].type=="LIVRAISON" ?this.iconLivraison :this.iconEnlevement
     icon:this.showMarkerByTurnType(this.itineraries[i].type)
   }).addTo(this.map).bindPopup("<b> Type : " + this.itineraries[i].type + "</b>"+"<br><b > Adresse :" + this.itineraries[i].description + "</b>").openPopup();
 }
   this.mainLayer.addTo(this.map);

 // this.recuperateDistance();
 }

  showMarkerByTurnType(type :string){
    if(type =="LIVRAISON"){
     return this.iconLivraison;
    }else if(type =="ENLEVEMENT"){
      return this.iconEnlevement;
    }else{
      return this.iconEnlevementLivraison;
    }

  }

 createLayer(){
//  this.mainLayer =L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
//   attribution: '<a href="https://www.lije-creative.com">LIJE Creative</a>',
//   maxZoom: 18
// })
//  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// });

//    this.mainLayer =L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
//      maxZoom: 20,
//      subdomains:['mt0','mt1','mt2','mt3']
//  });
//  this.map = L.map('map', {});


 this.mainLayer= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
this.map = L.map('map', {});
 }

//  recuperateDistance(){
//    L.Routing.control({
//      addWaypoints: false,
//      routeWhileDragging: false,
//           waypoints: [
//          L.latLng(this.orderTransportInfoLignes[0].addressContactDeliveryInfo.latitude, this.orderTransportInfoLignes[0].addressContactDeliveryInfo.longitude),

//      ],
//    }).addTo(this.map).hide();
//  }
  onHideDialog() {
    const a = false;
    this.selectItineraryInfo.distance=this.distance;
    this.selectItineraryInfo.heur=this.heur;
    this.selectItineraryInfo.minute=this.minute;
    this.selectItineraryInfo.time=this.time;
    this.itineraryInfo.emit(this.selectItineraryInfo);
    this.showDialog.emit(a);
    this.displayDialog = false;
  }

}
