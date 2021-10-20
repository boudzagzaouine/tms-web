import { Component, OnInit } from '@angular/core';
import { Patrimony } from './../../../shared/models/patrimony';
import { Vehicle, VehicleCategory } from './../../../shared/models';
import { PatrimonyService } from './../../../shared/services/api/patrimony-service';
import { VehicleCategoryService } from './../../../shared/services';
import { DashboardService } from './../../../shared/services/api/dashboard.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard-vehicle',
  templateUrl: './dashboard-vehicle.component.html',
  styleUrls: ['./dashboard-vehicle.component.css']
})
export class DashboardVehicleComponent implements OnInit {

  codeSearch: Vehicle;
  vehicleCodeList: Array<Patrimony> = [];
  vehicleCategoryList: Array<VehicleCategory> = [];
  categorySearch: VehicleCategory;
 dateSearch :Date;
 averageConsumption :number =0;
 mileageTraveled : number=0;
 correctiveMaintenanceCosts :number=0;
 preventiveMaintenanceCosts :number=0;
 totalNumberOfProblems : number=0;
 seniorityList:any[];
 senioritySearch:any;
 percentageCorrective : number =0;
 percentagePreventive : number =0;


 basicData: any;
 basicOptions: any;
 subscription: Subscription;

 dataG: any;

 data: any;
 chartOptions: any;
// config: AppConfig;

  constructor(    private patrimonyService: PatrimonyService,
    private vehicleCategoryService: VehicleCategoryService,
    private dashboardService :DashboardService,      
   // private configService: AppConfigService 
    ) { }

  ngOnInit(): void {

    this.percentageCorrective = 60;
    this.percentagePreventive=40;
   
    this.data = {
        labels: ['Maintenance Corrective','Maintenance Preventive'],
        datasets: [
            {
                data: [60, 40],
                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                   
                ],
                hoverBackgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    
                ]
            }
        ]
    };
    this.basicData = {
      labels: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet','août','septembre','octobre','novembre','décembre'],
      datasets: [
          {
              label: 'Maintenance Corrective',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: '#42A5F5',
              tension: .4
          },
          {
              label: 'Maintenance Préventive',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderColor: '#FFA726',
              tension: .4
          }
      ]
  };

  this.dataG = {
    labels: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet','août','septembre','octobre','novembre','décembre'],
    datasets: [ {
        type: 'bar',
        label: 'Gasoil',
        backgroundColor: '#66BB6A',
        data: [
            21,
            84,
            24,
            75,
            37,
            65,
            34
        ],
        borderColor: 'white',
        borderWidth: 2
    }, ]
};


  this.applyLightTheme();
  this.chartOptions = this.getLightTheme();





    
    
    this.vehicleCategoryService.findAll().subscribe(
      data => {
        this.vehicleCategoryList = data;
      }
    )

    this.seniorityList=[{mode :'2' , header:"Moins d'un an",slice1:'0',slice2:'1'},
                 {mode :'2' , header:"entre 1 et 3 ans",slice1:'0',slice2:'1'},
                 {mode :'2' , header:"entre 3 et 5 ans",slice1:'0',slice2:'1'},
                 {mode :'2' , header:"entre 5 et 10 ans",slice1:'0',slice2:'1'},
                 {mode :'1' , header:"plus de 10 ans",slice1:'0',slice2:'10'}]



  }

  getLightTheme() {
    return {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    }
}
  applyLightTheme() {
    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };}

   
  onSearchClicked(){



              if(this.senioritySearch != null && this.senioritySearch != undefined ){
             this.searchWithSeniority()
             console.log("seniority");
             
              } 
              
              else if (this.dateSearch !=null && this.dateSearch !=undefined ){
                this.searchWithVehicleDate();
                console.log("date");
                
              }

              this.percentageCorrective = (100*(this.correctiveMaintenanceCosts)/(this.preventiveMaintenanceCosts+this.correctiveMaintenanceCosts));
              this.percentagePreventive=(100*(this.preventiveMaintenanceCosts)/(this.preventiveMaintenanceCosts+this.correctiveMaintenanceCosts));
              this.data = {
                labels: ['Maintenance Corrective','Maintenance Preventive'],
                datasets: [
                    {
                        data: [ this.percentageCorrective, this.percentagePreventive],
                        backgroundColor: [
                            "#42A5F5",
                            "#66BB6A",
                           
                        ],
                        hoverBackgroundColor: [
                            "#64B5F6",
                            "#81C784",
                            
                        ]
                    }
                ]
            };
  }

  reset(){
    this.codeSearch=null;
    this.categorySearch=null;
    this.dateSearch=null;
    this.averageConsumption  =0;
    this.mileageTraveled =0;
    this.correctiveMaintenanceCosts =0;
    this.preventiveMaintenanceCosts =0;
    this.totalNumberOfProblems=0;
    this.senioritySearch=null;
  }


  onVehicleCodeSearch(event: any) {
   this.patrimonyService.find('code~' + event.query).subscribe(
      data => this.vehicleCodeList = data.filter(f=> f.patrimony_type=='vehicule')
     
    )
  }

  onSelectVehicle(event : Vehicle){
 this.categorySearch=event.vehicleCategory;
  
  }


 searchWithVehicleDate(){

  let vehicleId,categoryId;
    let dateDebut= new Date() ,dateFin = new Date();

    if (this.codeSearch != null && this.codeSearch.code !== '') {
       vehicleId =this.codeSearch.id;
       categoryId =0;   

    }
    if (this.categorySearch != null && this.categorySearch.code !== '') {
       categoryId =this.categorySearch.id;   
       vehicleId =0;

     }

     if (this.dateSearch != null ) { 
         dateDebut =this.dateSearch[0]  ;
         dateFin =this.dateSearch[1];
     }


   this.dashboardService.getAverageConsumption(vehicleId,categoryId, dateDebut.toLocaleDateString(), dateFin.toLocaleDateString())
   .subscribe(
    data => {
      this.averageConsumption=data;
      
    });

    this.dashboardService.getCorrectivemaintenancecostsbyvehicle(vehicleId,categoryId, dateDebut.toLocaleDateString(), dateFin.toLocaleDateString())
   .subscribe(
    data => {
this.correctiveMaintenanceCosts=data;  
console.log("corr");
 
console.log(this.correctiveMaintenanceCosts);
   
    });

    this.dashboardService.getPreventivemaintenancecostsbyvehicle(vehicleId,categoryId, dateDebut.toLocaleDateString(), dateFin.toLocaleDateString())
   .subscribe(
    data => {
this.preventiveMaintenanceCosts=data;  
console.log("preventi");
  
console.log(this.preventiveMaintenanceCosts);  
    });

    this.dashboardService.getTraveledmileagebyvechile(vehicleId,categoryId, dateDebut.toLocaleDateString(), dateFin.toLocaleDateString())
   .subscribe(
    data => {
this.mileageTraveled=data;      
    });

    this.dashboardService.getTotalnumberofproblemsbyvehicle(vehicleId,categoryId, dateDebut.toLocaleDateString(), dateFin.toLocaleDateString())
   .subscribe(
    data => {
this.totalNumberOfProblems=data;      
    });

 }


 searchWithSeniority(){

  let mode ,slice1,slice2,categoryid;
  mode=this.senioritySearch.mode;
  slice1=this.senioritySearch.slice1;
  slice2=this.senioritySearch.slice2;
  categoryid=0;
  if(this.categorySearch!=null && this.categorySearch!=undefined){
    categoryid=this.categorySearch.id;
  }


   this.dashboardService.getAverageConsumptionseniorityvehicle(categoryid,slice1, slice2, mode)
   .subscribe(
    data => {
      this.averageConsumption=data;
      
    });

    this.dashboardService.getCorrectivemaintenancecostsbyseniorityvehicle(categoryid,slice1, slice2, mode)
   .subscribe(
    data => {
this.correctiveMaintenanceCosts=data;      
console.log("corr");
 
console.log(this.correctiveMaintenanceCosts);
    });

    this.dashboardService.getPreventivemaintenancecostsbyseniorityvehicle(categoryid,slice1, slice2, mode)
   .subscribe(
    data => {
this.preventiveMaintenanceCosts=data;      
console.log("preventi");
  
console.log(this.preventiveMaintenanceCosts);
    });

    this.dashboardService.getTraveledmileagebyseniorityvehicle(categoryid,slice1, slice2, mode)
   .subscribe(
    data => {
this.mileageTraveled=data;      
    });

    this.dashboardService.getTotalnumberofproblemsbyseniorityvehicle(categoryid,slice1, slice2, mode)
   .subscribe(
    data => {
this.totalNumberOfProblems=data;      
    });

 }
}
