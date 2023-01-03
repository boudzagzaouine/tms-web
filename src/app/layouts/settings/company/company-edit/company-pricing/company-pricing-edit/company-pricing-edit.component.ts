import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaysService } from './../../../../../../shared/services/api/pays.service';
import { VilleService } from './../../../../../../shared/services/api/ville.service';
import { VatService } from './../../../../../../shared/services/api/vat.service';
import { TransportServcie } from './../../../../../../shared/services/api/transport.service';
import { VehicleTrayService } from './../../../../../../shared/services/api/vehicle-tray.service';
import { LoadingTypeService } from './../../../../../../shared/services/api/loading-type.service';
import { TurnTypeService } from './../../../../../../shared/services/api/turn-type.service';
import { VehicleCategoryService } from './../../../../../../shared/services/api/vehicle-category.service';
import { AuthenticationService } from './../../../../../../shared/services/api/authentication.service';
import { AccountPricingService } from './../../../../../../shared/services/api/account-pricing.service';
import { Pays } from './../../../../../../shared/models/pays';
import { VehicleTray } from './../../../../../../shared/models/vehicle-tray';
import { LoadingType } from './../../../../../../shared/models/loading-type';
import { Vat } from './../../../../../../shared/models/vat';
import { Ville } from './../../../../../../shared/models/ville';
import { TurnType } from './../../../../../../shared/models/turn-Type';
import { Transport } from './../../../../../../shared/models/transport';
import { VehicleCategory } from './../../../../../../shared/models/vehicle-category';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountPricing } from './../../../../../../shared/models/account-pricing';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-company-pricing-edit',
  templateUrl: './company-pricing-edit.component.html',
  styleUrls: ['./company-pricing-edit.component.scss']
})
export class CompanyPricingEditComponent implements OnInit {

  @Input() selectAccountPricing = new AccountPricing();
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();

  accountPricingForm: FormGroup;
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
    private accountPricingService: AccountPricingService,
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
      this.selectAccountPricing = new AccountPricing();
      this.title = 'Ajouter  Tarif';

    }

    this.displayDialog = true;
    this.initForm();

  }

  initForm() {
    this.accountPricingForm = new FormGroup({
      'fVehicleCategory': new FormControl(this.selectAccountPricing?.vehicleCategory, Validators.required),
      'fVehicleTray': new FormControl(this.selectAccountPricing?.vehicleTray, Validators.required),
      'fLoadingType': new FormControl(this.selectAccountPricing?.loadingType, Validators.required),
      'fTurnType': new FormControl(this.selectAccountPricing?.turnType, Validators.required),

      'fPaysSource': new FormControl(this.selectAccountPricing?.paysSource, Validators.required),
      'fVilleSource': new FormControl(this.selectAccountPricing?.villeSource, Validators.required),
      'fPaysDestination': new FormControl(this.selectAccountPricing?.paysDestination, Validators.required),
      'fVilleDestination': new FormControl(this.selectAccountPricing?.villeDestination, Validators.required),




         'fSaleAmountHt': new FormControl(this.selectAccountPricing.saleAmountHt, Validators.required),
         'fSaleAmountTtc': new FormControl(this.selectAccountPricing.saleAmountTtc, Validators.required),
         'fSaleAmountTva': new FormControl(this.selectAccountPricing.saleAmountTva, Validators.required),
         'fSaleVat': new FormControl(

          this.editMode!=1 ?this.selectAccountPricing?.saleVat?.value:this.selectAccountPricing?.saleVat,

          Validators.required),
    });
  }
  onSubmit() {
    console.log(this.accountPricingForm);
    this.isFormSubmitted = true;
    if (this.accountPricingForm.invalid) { return; }

    this.spinner.show();
console.log(this.editMode);


console.log(this.selectAccountPricing);

    if (this.editMode === 1) {


       this.existTransport();
    } else if (this.editMode === 2) {


           this.insertcatalogTransport();
    }


   // this.selectAccountPricing = new AccountPricing();


  }

  existTransport() {
    this.accountPricingService.sizeSearch(`loadingType.id:${this.loadingTypeId},turnType.id:${this.turnTypeid},vehicleCategory.id:${this.catVehicleId},vehicleTray.id:${this.vehicleTrayId},villeSource.id:${this.villeSourceId},villeDestination.id:${this.villeDestinationId}`).subscribe(
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


    this.selectAccountPricing.saleAmountHt = this.accountPricingForm.value['fSaleAmountHt'];
    this.selectAccountPricing.saleAmountTtc = this.accountPricingForm.value['fSaleAmountTtc'];
    this.selectAccountPricing.saleAmountTva = this.accountPricingForm.value['fSaleAmountTva'];

    // this.selectAccountPricing.turnType = this.accountPricingForm.value['fTurnType'];

    //  this.selectAccountPricing.vehicleCategory = this.accountPricingForm.value['fVehicleCategory'];
    //  this.selectAccountPricing.villeDestination = this.accountPricingForm.value['fVilleDestination'];
    //  this.selectAccountPricing.villeSource = this.accountPricingForm.value['fVilleSource'];
   // this.selectAccountPricing.vat =  this.vatList.filter(f=> f.value== this.accountPricingForm.value['fVat'])[0];
    console.log(this.selectAccountPricing);

    this.accountPricingService.set(this.selectAccountPricing).subscribe(
      data => {
        this.messageService.add({severity:'success', summary: 'Edition', detail: 'Elément Enregistré Avec Succès'});
 console.log(this.selectAccountPricing);

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
    this.selectAccountPricing.vehicleCategory = event.value;
    this.catVehicleId=this.selectAccountPricing.vehicleCategory.id;
  }
  onSelectTurnType(event: any) {
    this.selectAccountPricing.turnType = event.value;
    this.turnTypeid=this.selectAccountPricing.turnType.id;
   // this.catVehicleId=event.value.code;
  }

  onSelectloadingType(event){
   this.selectAccountPricing.loadingType=event.value;
   this.loadingTypeId=this.selectAccountPricing.loadingType.id;
  }
  onSelectvehicleTray(event){
    this.selectAccountPricing.vehicleTray=event.value;
   this.vehicleTrayId=this.selectAccountPricing.vehicleTray.id;
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



  onSelectSaleVat(event) {
    this.selectAccountPricing.saleVat=this.vatList.filter(f=> f.value== event.value)[0];
    this.onSalePriceChange(1);
  }

  onSelectPaysSource(event){
    this.selectAccountPricing.paysSource = event.value;
  }
  onSelectVilleSource(event: any) {
    this.selectAccountPricing.villeSource = event;
    this.villeSourceId = this.selectAccountPricing.villeSource.id;
  }

  onSelectPaysDistination(event){
    this.selectAccountPricing.paysDestination = event.value;
  }
  onSelectVilleDestination(event: any) {
    this.selectAccountPricing.villeDestination = event;
    this.villeDestinationId = this.selectAccountPricing.villeDestination.id;
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
    let PriceHt = +this.accountPricingForm.value['fSaleAmountHt'];
    let PriceTTC = +this.accountPricingForm.value['fSaleAmountTtc'];
    let vat = this.accountPricingForm.value['fSaleVat'];
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
    this.accountPricingForm.patchValue({
      'fSaleAmountTtc': priceTTC.toFixed(2),
      'fSaleAmountTva': amountTva.toFixed(2),
    });

    }if (n === 2) {

    PriceHt = PriceTTC / (1 + vat / 100);
    const amountTva = (PriceHt / 100) * vat;
      this.accountPricingForm.patchValue({
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
