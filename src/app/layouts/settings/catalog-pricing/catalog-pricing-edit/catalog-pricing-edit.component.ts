import { Pays } from './../../../../shared/models/pays';
import { PaysService } from './../../../../shared/services/api/pays.service';
import { VehicleTray } from './../../../../shared/models/vehicle-tray';
import { VehicleTrayService } from './../../../../shared/services/api/vehicle-tray.service';
import { LoadingType } from './../../../../shared/models/loading-type';
import { LoadingTypeService } from './../../../../shared/services/api/loading-type.service';
import { CatalogPricing } from './../../../../shared/models/catalog-pricing';
import { CatalogPricingService } from './../../../../shared/services/api/agent.service copy';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VilleService } from './../../../../shared/services/api/ville.service';
import { VatService } from './../../../../shared/services/api/vat.service';
import { TransportServcie } from './../../../../shared/services/api/transport.service';
import { TurnTypeService } from './../../../../shared/services/api/turn-type.service';
import { VehicleCategoryService } from './../../../../shared/services/api/vehicle-category.service';
import { AuthenticationService } from './../../../../shared/services/api/authentication.service';
import { Vat } from './../../../../shared/models/vat';
import { Ville } from './../../../../shared/models/ville';
import { TurnType } from './../../../../shared/models/turn-Type';
import { Transport } from './../../../../shared/models/transport';
import { VehicleCategory } from './../../../../shared/models/vehicle-category';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-catalog-pricing-edit',
  templateUrl: './catalog-pricing-edit.component.html',
  styleUrls: ['./catalog-pricing-edit.component.css']
})
export class CatalogPricingEditComponent implements OnInit {

  @Input() selectCatalogPricing = new CatalogPricing();
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();

  catalogPricingForm: FormGroup;
  vehicleCategorieList: VehicleCategory[] = [];
  transportList: Transport[] = [];
  turnTypeList :TurnType[]=[];
  villeList: Ville[] = [];
  vatList: Vat[] = [];
  vat = new Vat();
  displayDialog: boolean;
  isFormSubmitted = false;
  title = 'Modifier  Tarif';
  turnTypeid:number;
  transport : number;
  catVehicleId : number;
  villeSourceId : number;
  villeDestinationId : number ;
  loadingTypeId: number;
  vehicleTrayId:number;
  loadingTypeList:Array<LoadingType>=[];
  vehicleTrayList:Array<VehicleTray>=[];
  paysList:Array<Pays>=[];
  constructor(
    private catalogPricingService: CatalogPricingService,
    private authentificationService:AuthenticationService,
    private vehicleCategoryService: VehicleCategoryService,
    private turnTypeService:TurnTypeService,
    private loadingTypeService : LoadingTypeService,
    private vehicleTrayService : VehicleTrayService,
    private transportService: TransportServcie,
    private vatService: VatService,
    private villeService: VilleService,
    private paysService:PaysService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,

    ) { }

  ngOnInit() {
    this.vehicleCategoryService.findAll().subscribe(
      data => {
        this.vehicleCategorieList = data;
      }
    );

      this.load();
    if (this.editMode === 1) {
      this.selectCatalogPricing = new CatalogPricing();
      this.title = 'Ajouter  Tarif';

    }

    this.displayDialog = true;
    this.initForm();

  }

  initForm() {
    this.catalogPricingForm = new FormGroup({
      'fVehicleCategory': new FormControl(this.selectCatalogPricing?.vehicleCategory, Validators.required),
      'fVehicleTray': new FormControl(this.selectCatalogPricing?.vehicleTray, Validators.required),
      'fLoadingType': new FormControl(this.selectCatalogPricing?.loadingType, Validators.required),
      'fTurnType': new FormControl(this.selectCatalogPricing?.turnType, Validators.required),

      'fPaysSource': new FormControl(this.selectCatalogPricing?.paysSource, Validators.required),
      'fVilleSource': new FormControl(this.selectCatalogPricing?.villeSource, Validators.required),
      'fPaysDestination': new FormControl(this.selectCatalogPricing?.paysDestination, Validators.required),
      'fVilleDestination': new FormControl(this.selectCatalogPricing?.villeDestination, Validators.required),

      'fPurchaseAmountHt': new FormControl(this.selectCatalogPricing.purchaseAmountHt, Validators.required),
      'fPurchaseAmountTtc': new FormControl(this.selectCatalogPricing.purchaseAmountTtc, Validators.required),
      'fPurchaseAmountTva': new FormControl(this.selectCatalogPricing.purchaseAmountTva, Validators.required),
      'fPurchaseVat': new FormControl(
         this.editMode!=1 ?this.selectCatalogPricing?.purchaseVat?.value:this.selectCatalogPricing?.purchaseVat,
         Validators.required),


         'fSaleAmountHt': new FormControl(this.selectCatalogPricing.saleAmountHt, Validators.required),
         'fSaleAmountTtc': new FormControl(this.selectCatalogPricing.saleAmountTtc, Validators.required),
         'fSaleAmountTva': new FormControl(this.selectCatalogPricing.saleAmountTva, Validators.required),
         'fSaleVat': new FormControl(

          this.editMode!=1 ?this.selectCatalogPricing?.saleVat?.value:this.selectCatalogPricing?.saleVat,

          Validators.required),
    });
  }
  onSubmit() {
    console.log(this.catalogPricingForm);
    this.isFormSubmitted = true;
    if (this.catalogPricingForm.invalid) { return; }

    this.spinner.show();
console.log(this.editMode);


console.log(this.selectCatalogPricing);

    if (this.editMode === 1) {


       this.existTransport();
    } else if (this.editMode === 2) {


           this.insertcatalogTransport();
    }


   // this.selectCatalogPricing = new CatalogPricing();


  }

  existTransport() {
    this.catalogPricingService.sizeSearch(`loadingType.id:${this.loadingTypeId},turnType.id:${this.turnTypeid},vehicleCategory.id:${this.catVehicleId},vehicleTray.id:${this.vehicleTrayId},villeSource.id:${this.villeSourceId},villeDestination.id:${this.villeDestinationId}`).subscribe(
      data => {
console.log(data);

        if (data > 0) {
          this.messageService.add({severity:'error', summary: 'Edition', detail: 'Elément Existe Déja'});

          //this.toastr.error('Elément Existe Déja', 'Edition');
        } else {
          this.insertcatalogTransport();
        }
        this.spinner.hide();

      },
      error => {
       // this.toastr.error(error.error.message, 'Erreur');
       this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});


        this.spinner.hide();
      },

      () => this.spinner.hide()
    );
  }
  insertcatalogTransport(){

    this.selectCatalogPricing.purchaseAmountHt = this.catalogPricingForm.value['fPurchaseAmountHt'];
    this.selectCatalogPricing.purchaseAmountTtc = this.catalogPricingForm.value['fPurchaseAmountTtc'];
    this.selectCatalogPricing.purchaseAmountTva = this.catalogPricingForm.value['fPurchaseAmountTva'];

    this.selectCatalogPricing.saleAmountHt = this.catalogPricingForm.value['fSaleAmountHt'];
    this.selectCatalogPricing.saleAmountTtc = this.catalogPricingForm.value['fSaleAmountTtc'];
    this.selectCatalogPricing.saleAmountTva = this.catalogPricingForm.value['fSaleAmountTva'];

    // this.selectCatalogPricing.turnType = this.catalogPricingForm.value['fTurnType'];

    //  this.selectCatalogPricing.vehicleCategory = this.catalogPricingForm.value['fVehicleCategory'];
    //  this.selectCatalogPricing.villeDestination = this.catalogPricingForm.value['fVilleDestination'];
    //  this.selectCatalogPricing.villeSource = this.catalogPricingForm.value['fVilleSource'];
   // this.selectCatalogPricing.vat =  this.vatList.filter(f=> f.value== this.catalogPricingForm.value['fVat'])[0];
    console.log(this.selectCatalogPricing);

    this.catalogPricingService.set(this.selectCatalogPricing).subscribe(
      data => {
        this.messageService.add({severity:'success', summary: 'Edition', detail: 'Elément Enregistré Avec Succès'});
 console.log(this.selectCatalogPricing);

        //this.toastr.success('Elément Enregistré Avec Succès', 'Edition');
        this.displayDialog = false;
        this.isFormSubmitted = false;
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});

       // this.toastr.error(error.error.message);
        this.spinner.hide();
      },

      () => this.spinner.hide()
    );
  }

  onSelectVehicleCateory(event: any) {
    this.selectCatalogPricing.vehicleCategory = event.value;
    this.catVehicleId=this.selectCatalogPricing.vehicleCategory.id;
  }
  onSelectTurnType(event: any) {
    this.selectCatalogPricing.turnType = event.value;
    this.turnTypeid=this.selectCatalogPricing.turnType.id;
   // this.catVehicleId=event.value.code;
  }

  onSelectloadingType(event){
   this.selectCatalogPricing.loadingType=event.value;
   this.loadingTypeId=this.selectCatalogPricing.loadingType.id;
  }
  onSelectvehicleTray(event){
    this.selectCatalogPricing.vehicleTray=event.value;
   this.vehicleTrayId=this.selectCatalogPricing.vehicleTray.id;
  }

  onTransportSearch(event: any) {
    this.transportService
      .find('code~' + event.query)
      .subscribe(data => (this.transportList = data));
  }
  onVilleSourceSearch(event: any) {
    this.villeService
      .find('code~' + event.query)
      .subscribe(data => (this.villeList = data));
  }

  onSelectPurchaseVat(event) {
    this.selectCatalogPricing.purchaseVat= this.vatList.filter(f=> f.value== event.value)[0];
    this.onPurcahsePriceChange(1);
  }

  onSelectSaleVat(event) {
    this.selectCatalogPricing.saleVat=this.vatList.filter(f=> f.value== event.value)[0];
    this.onSalePriceChange(1);
  }

  onSelectPaysSource(event){
    this.selectCatalogPricing.paysSource = event.value;
  }
  onSelectVilleSource(event: any) {
    this.selectCatalogPricing.villeSource = event;
    this.villeSourceId = this.selectCatalogPricing.villeSource.id;
  }

  onSelectPaysDistination(event){
    this.selectCatalogPricing.paysDestination = event.value;
  }
  onSelectVilleDestination(event: any) {
    this.selectCatalogPricing.villeDestination = event;
    this.villeDestinationId = this.selectCatalogPricing.villeDestination.id;
  }


  onPurcahsePriceChange(n: Number) {
    let PriceHt = +this.catalogPricingForm.value['fPurchaseAmountHt'];
    let PriceTTC = +this.catalogPricingForm.value['fPurchaseAmountTtc'];
    let vat = this.catalogPricingForm.value['fPurchaseVat'];
    console.log(vat);


    if (PriceHt === undefined || PriceHt == null) {
      PriceHt = 0;
    } if (PriceTTC === undefined || PriceTTC == null) {
      PriceTTC = 0;
    } if (vat === undefined || vat == null) {
      vat = 0;
    }

    if (n === 1) {
      const amountTva = (PriceHt / 100) * vat;
    const priceTTC = PriceHt + amountTva;
    this.catalogPricingForm.patchValue({
      'fPurchaseAmountTtc': priceTTC.toFixed(2),
      'fPurchaseAmountTva': amountTva.toFixed(2),
    });

    }if (n === 2) {

    PriceHt = PriceTTC / (1 + vat / 100);
    const amountTva = (PriceHt / 100) * vat;
      this.catalogPricingForm.patchValue({
        'fPurchaseAmountHt': PriceHt.toFixed(2),
        'fPurchaseAmountTva':  amountTva.toFixed(2),
      });
    }

  }

  load(){
    this.turnTypeService.findAll().subscribe(
      data => {
        this.turnTypeList = data;
      }
    );
    this.villeService.findAll().subscribe(
      data => {
        this.villeList = data;
      }
    );
    this.vatService.findAll().subscribe(
      data => {
        this.vatList = data;
      }
    );

    this.loadingTypeService.findAll().subscribe(
      data => {
        this.loadingTypeList = data;
      }
    );

    this.vehicleTrayService.findAll().subscribe(
      data => {
        this.vehicleTrayList = data;
      }
    );

    this.paysService.findAll().subscribe(
      data => {
        this.paysList = data;
      }
    );
  }

  onSalePriceChange(n: Number) {
    let PriceHt = +this.catalogPricingForm.value['fSaleAmountHt'];
    let PriceTTC = +this.catalogPricingForm.value['fSaleAmountTtc'];
    let vat = this.catalogPricingForm.value['fSaleVat'];
    console.log(vat);


    if (PriceHt === undefined || PriceHt == null) {
      PriceHt = 0;
    } if (PriceTTC === undefined || PriceTTC == null) {
      PriceTTC = 0;
    } if (vat === undefined || vat == null) {
      vat = 0;
    }

    if (n === 1) {
      const amountTva = (PriceHt / 100) * vat;
    const priceTTC = PriceHt + amountTva;
    this.catalogPricingForm.patchValue({
      'fSaleAmountTtc': priceTTC.toFixed(2),
      'fSaleAmountTva': amountTva.toFixed(2),
    });

    }if (n === 2) {

    PriceHt = PriceTTC / (1 + vat / 100);
    const amountTva = (PriceHt / 100) * vat;
      this.catalogPricingForm.patchValue({
        'fSaleAmountHt': PriceHt.toFixed(2),
        'fSaleAmountTva':  amountTva.toFixed(2),
      });
    }

  }

  onShowDialog() {
    let a = false;
    this.showDialog.emit(a);
  }

}