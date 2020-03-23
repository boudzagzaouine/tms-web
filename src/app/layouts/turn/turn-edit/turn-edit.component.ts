import { TurnService } from './../../../shared/services/api/turn.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleOrderStockService } from './../../../shared/services/api/sale-order-stock.service';
import { SaleOrderStock } from './../../../shared/models/sale-order-stock';
import { DriverService } from './../../../shared/services/api/driver.service';
import { VehicleService } from './../../../shared/services/api/vehicle.service';
import { TransportServcie } from './../../../shared/services/api/transport.service';
import { VehicleCategoryService } from './../../../shared/services/api/vehicle-category.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Turn } from './../../../shared/models/turn';
import { VehicleCategory } from './../../../shared/models/vehicle-category';
import { DeliveryLine } from './../../../shared/models/delivery-line';
import { DeliveryService } from './../../../shared/services/api/Delivery.service';
import { Delivery } from './../../../shared/models/delivery';
import { MenuItem } from 'primeng/api';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-turn-edit',
  templateUrl: './turn-edit.component.html',
  styleUrls: ['./turn-edit.component.css']
})
export class TurnEditComponent implements OnInit {
  activeIndex: number = 0;
  items: MenuItem[];
  deliveries: Delivery[] = [];
  delivriesLoading: Delivery[] = [];
  delivrieLines: DeliveryLine[] = [];
  saleOrdersStock: SaleOrderStock[] = [];
  saleOrdersStockcopy: SaleOrderStock[] = [];

  vehicleCatList: VehicleCategory[] = [];
  transportList: Array<any> = [];
  vehicleList: Array<any> = [];
  driverList: Array<any> = [];
  turnAdded: Turn = new Turn();

  turnForm: FormGroup;
  catVehiculeQnt: boolean = false;
  totalqntV : number = 0;
  totalQnt:number = 0;
  constructor(
    private deliveryService: DeliveryService,
    private vehicleCategoryService: VehicleCategoryService,
    private transportService: TransportServcie,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private saleOrderStockService: SaleOrderStockService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private tunrService: TurnService
  ) { }

  ngOnInit() {
    this.initForm();

    this.vehicleCategoryService.findAll().subscribe(data => {
      this.vehicleCatList = data;
    });

    this.transportService.findAll().subscribe(data => {
      this.transportList = data;
    });

    this.driverService.findAll().subscribe(data => {
      this.driverList = data;
    });
    this.items = [
      {
        label: 'Livraison'
      },
      {
        label: '...........'
      },
      {
        label: '.........'
      }
    ];

    this.loaddata();
  }

  initForm() {
    this.turnForm = new FormGroup({
      fDateLivraison: new FormControl(
        this.turnAdded.dateDelivery,
        Validators.required
      ),
      fVehicule: new FormControl(this.turnAdded.vehicle, Validators.required),
      fTransport: new FormControl(
        this.turnAdded.transport,
        Validators.required
      ),
      fDrivers: new FormControl(this.turnAdded.drivers, Validators.required),
      fTypeVehicule: new FormControl('', Validators.required)
    });
  }

  onSubmit() {

    this.prepareSaleOrderStock();

    this.insertSaleOrderStock();
    console.log('turn stock');
    console.log(this.turnAdded.saleOrderStocks);


  }


  prepareSaleOrderStock() {
    const formValue = this.turnForm.value;

    this.turnAdded.vehicle = formValue['fVehicule'];
    this.turnAdded.dateDelivery = formValue['fDateLivraison'];
    this.turnAdded.transport = formValue['fTransport'];
    this.turnAdded.drivers = formValue['fDrivers'];

    this.delivriesLoading.forEach(value => {
      value.lines.forEach(valueLine => {
        this.saleOrdersStock.push(
          new SaleOrderStock(
            valueLine.delivery,
            valueLine.product,
            valueLine.owner,
            valueLine.dlc,
            valueLine.productPack,
            valueLine.uom,
            valueLine.orderedQuantity,
            valueLine,
            valueLine.warehouse

          )
        );
      });
      console.log('chargement sale order stock');
      console.log(this.saleOrdersStock);
    });
  }
  insertSaleOrderStock() {

    this.saleOrderStockService.saveAll(this.saleOrdersStock).subscribe(
      data => {
        this.turnAdded.saleOrderStocks = data;
        this.toastr.success('Elément est Enregistré Avec Succès SOS', 'Edition');
        this.saveTurn();
      },
      error => {
        this.toastr.error(error.error.message);
        console.log('error sos');
        console.log(error);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  saveTurn() {
    this.tunrService.set(this.turnAdded).subscribe(
      data => {
        this.toastr.success('Elément est Enregistré Avec Succès TURN', 'Edition');
      },
      error => {
        this.toastr.error(error.error.message);
        this.spinner.hide();
      },

      () => this.spinner.hide()
    );
    console.log('final turn');
    console.log(this.turnAdded);
  }






  onSelectChangeCatVehicle(event) {
    let codeCat = event.value;
    let sum: number = 0;

    this.vehicleService
      .find('vehicleCategory.code~' + codeCat.code)
      .subscribe(data => {
        this.vehicleList = data;
      });
this.totalqntV=codeCat.tonnage;
if(this.totalQnt>codeCat.tonnage){

  this.catVehiculeQnt=true;
}
else{
this.catVehiculeQnt=false;
}



  }

  loaddata() {
    this.deliveryService
      .find('orderStatus.code~' + 'En attente')
      .subscribe(data => {
        this.deliveries = data;
        console.log('chargement data delevry ');
        console.log(data);
      });
  }

  TotalQnt(d: Delivery) {
    let sum = 0;

    for (let i = 0; i < d.lines.length; i++) {
      sum += (d.lines[i].orderedQuantity - d.lines[i].quantityServed);

    }
  this.totalQnt =+sum;
    return sum;
  }


  previous() {
    this.activeIndex--;
  }

  next() {
    this.activeIndex++;

    if (this.activeIndex == 1) {
      this.loaddata();
    }
  }
}
