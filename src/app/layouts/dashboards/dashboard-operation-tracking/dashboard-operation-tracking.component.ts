import { SelectObject } from './../../../shared/models/select-object';
import { PatrimonyService } from './../../../shared/services/api/patrimony-service';
import { TransportPlanLocation } from './../../../shared/models/transport-plan-location';
import { OrderTransportInfoLine } from './../../../shared/models/order-transport-info-line';
import { itineraryInfo } from './../../../shared/models/itineraryInfo';
import { Itinerary } from './../../../shared/models/Itinerairy';
import { OrderTransportService } from './../../../shared/services/api/order-transport.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TransportPlanLocationService } from './../../../shared/services/api/transport-plan-location.service';
import { TransportPlanService } from './../../../shared/services/api/transport-plan.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DriverService } from './../../../shared/services/api/driver.service';
import { TurnStatusService } from './../../../shared/services/api/turn-status.service';
import { VehicleService } from './../../../shared/services/api/vehicle.service';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TransportPlan } from './../../../shared/models/transport-plan';
import { OrderTransport } from './../../../shared/models/order-transport';
import { Driver } from './../../../shared/models/driver';
import { Vehicle } from './../../../shared/models/vehicle';
import { EmsBuffer } from './../../../shared/utils/ems-buffer';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import  * as L  from 'leaflet';
import 'leaflet.awesome-markers';
import 'leaflet-routing-machine';
import { Marker, Icon,icon } from 'leaflet';
@Component({
  selector: 'app-dashboard-operation-tracking',
  templateUrl: './dashboard-operation-tracking.component.html',
  styleUrls: ['./dashboard-operation-tracking.component.scss']
})
export class DashboardOperationTrackingComponent implements OnInit,AfterViewInit,OnDestroy  {


  page = 0;
  size = 10;
  collectionSize: number;
  searchQuery = '';
  vehicleSearch: Vehicle;
  driverSearch: Driver;
  driverList:Driver[]=[];
  vehicleList:Vehicle[]=[];
  transportPlan:TransportPlan;
  orderTransportSearch: OrderTransport;
  orderTransportList:OrderTransport[]=[];

  statusSearch: SelectObject;


  className: string;
  cols: any[];
  editMode: number;
  showDialog: boolean;
  transportPlanList:TransportPlan[]=[];
  transportPlanCloneList:TransportPlan[]=[];

  subscriptions= new Subscription();
  dateSearch: Date[];

  items: MenuItem[];

  home: MenuItem;
  showdetailStep:number=0;
  selectItineraryInfo :itineraryInfo = new itineraryInfo();
  itinerary :Itinerary= new Itinerary();
  itineraries : Array<Itinerary>=[];
  map:any;
  mainLayer:any;
  distance :number ;
  otAffectedSize:number;
  otToAffectedSize:number;
  otReleaseInternSize:number;
  otReleaseSize:number;
  statusList: Array <SelectObject>=[{id:1,code:'En cours'},{id:2,code:'Fermés'}];

  private iconNone: L.Icon = icon({
    iconUrl: "./assets/img/none.png",
       iconSize:    [40, 40],


  });
  private iconDrive: Icon = icon({
    iconUrl: "./assets/img/drive.png",
       iconSize:    [40, 40],
  });
  private iconArrive: Icon = icon({
    iconUrl: "./assets/img/reserve.png",
       iconSize:    [40, 40],
  });
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  constructor(private vehicleService :VehicleService,
    private  turnStatusService:TurnStatusService,
             private driverservice:DriverService,
             private spinner: NgxSpinnerService,
             private toastr: ToastrService,
             private transportPlanService:TransportPlanService,
             private transportPlanLocationService:TransportPlanLocationService,
             private datePipe:DatePipe,
             private decimalPipe:DecimalPipe,
             private orderTransportService:OrderTransportService,
             private patrimonyService:PatrimonyService) { }

  ngOnInit() {




//     Marker.prototype.options.icon = this.iconNone;

//  this.createLayer();
//if (this.mapContainer) {

//}
console.log(this.mapContainer);

// if (this.mapContainer) {
//  if (this.mapContainer.nativeElement.hasChildNodes()) {
//   const existingMap = this.mapContainer.nativeElement.firstChild;
//   if (existingMap instanceof L.Map) {
//     existingMap.remove(); // Remove existing map
//   }
// }
// }
//this.searchQuery="turnStatus.id!1;2;3;4"; //1cree - 2valider -3ferme - 4 annuler
this.statusSearch=this.statusList.filter(f=>f.id==1)[0];

console.log(this.statusList.filter(f=>f.id==1)[0]);
this.searchQuery = 'turnStatus.id!3;4;1;2';

    this.loadData(this.searchQuery);
this.loadOTAffected();
this.loadOTToAffected();
this. loadOTReleaseInterne();
this. loadOTRelease();
  }


  ngAfterViewInit(){

    Marker.prototype.options.icon = this.iconNone;

 this.createLayer();


}


loadOTAffected(dates:string='') {
 let  search: string = ''
 console.log(dates);

//  let searchDate=dates.replace("dateDepart","date");
//  searchDate=searchDate.replace("dateDepart","date");
    // search +='turnStatus.id!1,'+dates;
console.log();


  this.spinner.show();
  this.subscriptions.add(this.transportPlanService.sizeSearch(dates).subscribe(
    data => {
      this.otAffectedSize = data;
      this.spinner.hide();

    }
  ));

}

loadOTToAffected(dates:string='') {
  let  search: string = ''
    let searchDate=dates.replace("dateDepart","date");
    searchDate=searchDate.replace("dateDepart","date");
  search +='turnStatus.id:1,'+searchDate;



   this.spinner.show();
   this.subscriptions.add(this.orderTransportService.sizeSearch(search).subscribe(
     data => {
       this.otToAffectedSize = data;
       console.log( this.otToAffectedSize);

       this.spinner.hide();
     }
   ));

 }
 loadOTReleaseInterne(dates:string='') {
  let  search: string = ''

    search ='turnStatus.id:3'+',transport.id:10152,'+dates;


   this.spinner.show();
   this.subscriptions.add(this.transportPlanService.sizeSearch(search).subscribe(
     data => {
       this.otReleaseInternSize = data;
       this.spinner.hide();
     }
   ));

 }


 loadOTRelease(dates:string='') {
  let  search: string = ''

       search ='turnStatus.id:3,'+dates;




   this.spinner.show();
   this.subscriptions.add(this.transportPlanService.sizeSearch(search).subscribe(
     data => {
       this.otReleaseSize = data ;
       this.spinner.hide();
     }
   ));

 }

  onSearchClicked() {
let searchkpi='';
    const buffer = new EmsBuffer();
    this.spinner.show();
    if (this.orderTransportSearch != null && this.orderTransportSearch.id !== undefined) {
      buffer.append(`orderTransport.id:${this.orderTransportSearch.id}`);
    }
    if (this.vehicleSearch != null && this.vehicleSearch !== undefined) {
      buffer.append(`vehicle.registrationNumber:${this.vehicleSearch.registrationNumber}`);
    }
    if (this.driverSearch != null && this.driverSearch !== undefined) {
      buffer.append(`driver.id:${this.driverSearch.id}`);
    }

    if (this.statusSearch != null ) {
      if(this.statusSearch.id==1){// en cours
        //en Cour
      buffer.append('turnStatus.id!3;4;1;2');

      }
      else if (this.statusSearch.id==2){//fermer
        //Fermer
      buffer.append('turnStatus.id:3');
    }
    // else if (this.statusSearch.id==3){//planifier = cree
    //     //Fermer
    //   buffer.append('turnStatus.id:1');

    //   }
    }
    if (this.dateSearch != null && this.dateSearch !== undefined) {
      let dateD,dateF;
      dateD=this.datePipe.transform(this.dateSearch[0],'yyyy-MM-dd');
      dateF=this.datePipe.transform(this.dateSearch[1],'yyyy-MM-dd');
      if(dateD!=null){
      buffer.append("dateDepart>"+dateD);
searchkpi+="dateDepart>"+dateD;
      }
      if(dateF!=null){
        buffer.append("dateDepart<"+dateF);
        searchkpi+=",dateDepart<"+dateF;

        }
 this.loadOTAffected(searchkpi);
this.loadOTToAffected(searchkpi);
this. loadOTReleaseInterne(searchkpi);
this. loadOTRelease(searchkpi);
    }

    this.page = 0;
    this.searchQuery = buffer.getValue();
    console.log(this.searchQuery);

    this.loadData(this.searchQuery);
    this.spinner.hide();
  }

  reset() {
    this.vehicleSearch = null;
   this.driverSearch=null;
   this.dateSearch=null;
   this.statusSearch=null;
   this.orderTransportSearch=null;
    this.page = 0;
    this.statusSearch=this.statusList.filter(f=>f.id==1)[0];
    //this.searchQuery="turnStatus.id!1;2;3;4"; //1cree - 2valider -3ferme - 4 annuler
    this.searchQuery = 'turnStatus.id!3;4;1;2';

    this.loadData(this.searchQuery);
this.loadOTAffected();
this.loadOTToAffected();
this. loadOTReleaseInterne();
this. loadOTRelease();
this.showdetailStep =0;
// this.map.eachLayer((layer) => {
//   layer.remove();
// });


if(this.map) {
  this.map.remove();
  this.createLayer();
}





  }

    loadData(search: string = '') {
      this.spinner.show();

      this.subscriptions.add(this.transportPlanService.sizeSearch(search).subscribe(
        data => {
          this.collectionSize = data;
        }
      ));
      this.subscriptions.add(this.transportPlanService.findPagination(this.page, this.size, search).subscribe(
        data => {

          this.transportPlanList = data;
          if(!this.transportPlanList[0]){
            this.toastr.info(' Aucun résultat trouvé pour la recherche effectuée', '');

          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        },
        () => this.spinner.hide()
      ));
    }
    loadDataLazy(event) {
      this.size = event.rows;
      this.page = event.first / this.size;
      this.loadData(this.searchQuery);
    }


    onVehicleSearch(event){
      this.subscriptions.add(this.patrimonyService.find('code~' + event.query).subscribe(
        data => this.vehicleList = data
      ));
    }

    onDriverSearch(event) {

      let search;
         if (!isNaN(event.query)) {
           search = "code~" + event.query;
         } else {
           search = "name~" + event.query;
         }
         this.driverservice
           .find(search)
           .subscribe((data) =>{console.log(data);
            (this.driverList = data)});



       }


    onOrderTransportSearch(event){
      this.subscriptions.add(this.orderTransportService.find('code~' + event.query).subscribe(
        data => this.orderTransportList = data
      ));
    }



    showDetailPlanTransport(transportPlan:TransportPlan){
      this.map.eachLayer((layer) => {
        layer.remove();
      });
  this.showdetailStep=1;
      this.subscriptions.add( this.transportPlanService.getItineraries(this.page,this.size,'id:'+transportPlan?.id).subscribe(
        data => {

          this.transportPlan = data[0];
          console.log( this.transportPlan);
          this.cloneItiniraryOrderByTransportPlan();
  // this.transportPlanCloneList=data;
        }))



    }

    previous(){
      this.showdetailStep--;
    }




addMarkerDetail(line:OrderTransportInfoLine){


this.transportPlanLocationService.find('orderTransportInfoLine.id:'+line.id+',type:notnull').subscribe(
  data=>{
let locations :TransportPlanLocation[]=[];
locations = data;
console.log(data);




locations.forEach(location=>{

console.log(location);


  var split_route1:L.LatLng[]=[];


  split_route1.push(new L.LatLng(line?.address?.latitude ,  line?.address?.longitude,0 ));
  split_route1.push(new L.LatLng(location.latitude ,  location.longitude,0 ));

console.log(split_route1);

var route= L.Routing.control({
routeWhileDragging: true,
addWaypoints: false,

waypoints: split_route1,

}).on('routesfound',(e)=>{
console.log(e);
  this.distance=e.routes[0].summary.totalDistance/1000 as number;


  let message="";

  console.log(location.type );


  if(location.type =="ARRIVÉ"){
    console.log(location.type );
    message +=  " <b> arrivée :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+ this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"
   }
   else if(location.type =="CHARGEMENT" ){
    console.log(location.type );
    message +=  " <b> CHARGEMENT :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"

   }
   else if(location.type =="FIN CHARGEMENT" ){
    console.log(location.type );
    message +=  " <b> FIN CHARGEMENT :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"

   }
   else if(location.type =="DÉCHARGEMENT" ){
    console.log(location.type );
    message +=  " <b> DÉCHARGEMENT :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"

   }
   else if(location.type =="FIN DÉCHARGEMENT" ){
    console.log(location.type );
    message +=  " <b> FIN DECHARGEMENT :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"

   }
   else if(location.type =="FERMÉ" ){
    console.log(location.type );
    message +=  " <b> FIN :"+this.datePipe.transform(location.date,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
    " <b> Distance :"+this.decimalPipe.transform(this.distance,'1.2-2')+"KM</b><br>"

   }

L.marker(L.latLng(location.latitude, location.longitude), {
  icon:this.iconArrive

    }).addTo(this.map).bindPopup(message,)
    //.openPopup()
    .on("popupopen", (a) => {
      var popUp = a.target.getPopup()
      popUp.getElement()
        })





}).addTo(this.map).hide();






console.log("distance apres");

console.log(this.distance);





    //.on('click', this.onClick);



})
    this.mainLayer.addTo(this.map);





  }
)





















}



createLayer(){

  this.map = new L.Map('map', {
    center: [ 31.942037500922847, -6.391733638504066 ],
    zoom: 5,
    renderer: L.canvas()
  })

  // this.mainLayer=L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  //     maxZoom: 8,
  //     subdomains:['mt0','mt1','mt2','mt3']
  // }).addTo(this.map);
  //this.map = L.map('map', {});

   this.mainLayer= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);
  }

  cloneItiniraryOrderByTransportPlan(){


    this.itineraries=[];





  let  itineraries :Itinerary[]=[];
  if( this.transportPlan?.latitude!=null && this.transportPlan?.longitude!=null){


   this.itinerary= new Itinerary();
    this.itinerary.lat= this.transportPlan?.latitude;
    this.itinerary.lon=this.transportPlan?.longitude;
     this.itinerary.vehicle= this.transportPlan.vehicle;
    this.itinerary.driver= this.transportPlan.driver;
    itineraries.push(this.itinerary);
}
    this.transportPlan.orderTransport.orderTransportInfos.forEach(info => {

      info.orderTransportInfoLines.forEach(line =>{


        this.itinerary= new Itinerary();
        this.itinerary.lat= line.address?.latitude;
        this.itinerary.lon=line.address?.longitude;
        this.itinerary.orderTransportInfoLine=line;

        this.itinerary.description=line?.contact?.name;
        this.itinerary.type=line?.orderTransportType?.code;
        this.itinerary.status=line?.turnStatus?.code;
        this.itinerary.dateArriver=line?.dateArriver;
        this.itinerary.dateCommancerChargement=line?.dateCommancerChargement;
        this.itinerary.dateCommancerDechargement=line?.dateCommancerDechargement;
        this.itinerary.dateFinDechargement=line?.dateFinDechargement;
        this.itinerary.dateFinChargement=line?.dateFinChargement;
        this.itinerary.lineNumber=line?.lineNumber;
        this.itinerary.date=line?.dateArriver!=undefined ? line?.dateArriver: line.date;

        this.itinerary.vehicle= this.transportPlan.vehicle;
        this.itinerary.driver= this.transportPlan.driver;


        itineraries.push(this.itinerary);

      })

       });
        itineraries.sort((a, b) => {
        return <any>new Date(b.date) + <any>new Date(a.date);
      });
      // this.createMarker(itineraries);
      this.createRoute(itineraries);


  }


 createRoute(itineraries) {
  console.log('itineraire');

  console.log(itineraries);

  this.itineraries=itineraries
  this.spinner.show();
  const  dis = null;
  var split_route1:L.LatLng[]=[];


this.itineraries.forEach(element => {
  if(element.type!=undefined){
         split_route1.push(new L.LatLng(element.lat ,  element.lon,0 ));
         }
});
//var polyline = L.polyline(split_route1, {color: 'white'}).addTo(this.map);
var pane1 = this.map.createPane(this.itineraries[0]?.orderTransportInfoLine?.id.toString());
//console.log(this.getRandomColor2());

 var route= L.Routing.control({
    routeWhileDragging: true,
    addWaypoints: false,

    waypoints: split_route1,
lineOptions: {styles: [{pane:pane1, color: '#0cb0fb', opacity: 1, weight: 4}],missingRouteTolerance:2,extendToWaypoints:true},




}).on('routesfound',(e)=>{

// this.distance=e.routes[0].summary.totalDistance/1000 as number;
// console.log(e.routes[0].summary.totalTime);

// this.time= (e.routes[0].summary.totalTime/3600).toString();
// this.heur=  this.time.split('.',2)[0];
// this.minute=this.time.split('.',2)[1].substring(0,2);



// this.selectItineraryInfo.distance=this.distance;
// this.selectItineraryInfo.heur=this.heur;
// this.selectItineraryInfo.minute=this.minute;
// this.selectItineraryInfo.time=this.time;
//this.itineraryInfo.emit(this.selectItineraryInfo);



//new Date()
}
).addTo(this.map).hide();


this.createMarker(  this.itineraries);
}

createMarker(itineraries){
this.itineraries=itineraries;

  for (var i in this.itineraries) {
    let message="" ;
    let ot = this.itineraries[i]?.transportPlan?.id;
    if(this.itineraries[i].type!=undefined){

      message += "<b> Type : " + this.itineraries[i].type + "</b>"+"<br><b > Client :" + this.itineraries[i].description +
      "</b><br>";
      if(this.itineraries[i].type =="ENLEVEMENT" || this.itineraries[i].type =="ENLEVEMENT/LIVRAISON" ){
       message +=  " <b> arrivée :"+this.datePipe.transform(this.itineraries[i].dateArriver,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
       " <b> Debut Chargement :"+this.datePipe.transform(this.itineraries[i].dateCommancerChargement,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
      " <b> Fin Chargement :"+this.datePipe.transform(this.itineraries[i].dateFinChargement,'dd-MM-yyyy HH:mm:ss')+"</b> <br>"

      }
      else if(this.itineraries[i].type =="LIVRAISON" || this.itineraries[i].type =="ENLEVEMENT/LIVRAISON" ){
       message +=  " <b> arrivée :"+this.datePipe.transform(this.itineraries[i].dateArriver,'dd-MM-yyyy HH:mm:ss')+"</b><br>"+
       " <b>Debut Dechargement :"+this.datePipe.transform(this.itineraries[i].dateCommancerDechargement,'dd-MM-yyyy HH:mm:ss')+"</b> <br>"+
      " <b> Fin Dechargement :"+this.datePipe.transform(this.itineraries[i].dateFinDechargement,'dd-MM-yyyy HH:mm:ss')+"</b> <br>"
      }

      message +=  " <b> Statut :"+this.itineraries[i].status+"</b><br>";


    }
    else{
      message += "<i class='fa fa-road'  style='    color: #ee8e8f;'> </i><b> En Route<br>"+
      "<i class='fa fa-truck mr-2' style='    color: #ee8e8f;'></i>"+this.itineraries[i]?.vehicle?.registrationNumber +
      "<br><i class='fa fa-user mr-2' style='    color: #ee8e8f;' ></i> "+this.itineraries[i]?.driver?.codeName ;
    // message +="<br><button type='button' class='btn btn-primary p-0' style='width: 100%;'>Détails</button>"

    }




    var numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.textContent =''+ this.itineraries[i].lineNumber;



    L.marker(L.latLng(this.itineraries[i].lat, this.itineraries[i].lon), {

  icon:  this.itineraries[i].type!=undefined ?  new L.DivIcon({
    className: 'circleMarker',
     iconSize:[90, 90],
    html: numberDiv
  },) :this.iconDrive


    //  title: this.itineraries[i].description ,
    // icon:
    // L.AwesomeMarkers.icon({
    //   icon: "coffee",
    //   markerColor: "orange",
    //   prefix: "fa",
    //   iconColor: "black"

    //   })

      //icon: this.itineraries[i].type=="LIVRAISON" ?this.iconLivraison :this.iconEnlevement
    //  icon:this.showMarkerByTurnType(this.itineraries[i].type),
   //draggable:true,
   //zIndexOffset:1,
    }).addTo(this.map).bindPopup(message,)
    //.openPopup()
    .on("popupopen", (a) => {
      var popUp = a.target.getPopup()
      popUp.getElement()
        })
    //.on('click', this.onClick);


  }

    this.mainLayer.addTo(this.map);

  // this.recuperateDistance();
  this.spinner.hide();

}


ngOnDestroy(): void {
  // Clean up resources here if needed


  // this.map.fitBounds(this.map.getBounds());

console.log(this.map);

  this.map.invalidateSize();



  if (this.map) {
    this.map.eachLayer((layer) => {
      layer.remove();
    });
    this.map.off();
    this.map.remove(); // Remove the map when the component is destroyed
  }

  // if (this.mapContainer.nativeElement.hasChildNodes()) {
  //   const existingMap = this.mapContainer.nativeElement.firstChild;
  //   if (existingMap instanceof L.Map) {
  //     existingMap.remove(); // Remove existing map
  //   }
  // }
}

}
