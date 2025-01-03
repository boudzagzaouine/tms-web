import { AccountPricingServiceService } from './../../../../shared/services/api/account-pricing-service.service';
import { CatalogService } from "./../../../../shared/models/catalog-service";
import { VatService } from "./../../../../shared/services/api/vat.service";
import { Vat } from "./../../../../shared/models/vat";
import { AccountService } from "./../../../../shared/services/api/account.service";
import { CatalogServiceService } from "./../../../../shared/services/api/catalog-service.service";
import { TransportAccountServiceService } from "./../../../../shared/services/api/transport-account-service.service";
import { TransportAccountService } from "./../../../../shared/models/transport-account-service";
import { TransportServiceService } from "./../../../../shared/services/api/transport-service.service";
import { Transport } from "./../../../../shared/models/transport";
import { Account } from "./../../../../shared/models/account";
import { Company } from "./../../../../shared/models/company";
import { TransportPlanServiceCatalogService } from "./../../../../shared/services/api/transport-Plan-service-catalog.service";
import { ProductServiceService } from "../../../../shared/services/api/product-service.service";
import { AuthenticationService } from "../../../../shared/services/api/authentication.service";
import { Subscription } from "rxjs";
import { Product } from "../../../../shared/models/product";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TransportPlanServiceCatalog } from "../../../../shared/models/transport-plan-service-catalog";
import { TransportServcie } from "./../../../../shared/services/api/transport.service";

@Component({
  selector: 'app-transport-plan-add-service-edit',
  templateUrl: './transport-plan-add-service-edit.component.html',
  styleUrls: ['./transport-plan-add-service-edit.component.scss']
})
export class TransportPlanAddServiceEditComponent implements OnInit {

  @Input() selectedAccount: Account = new Account();
  @Input() type:number // 1 add Or  2 edit
  @Input() selectedTransportServiceCatalog: TransportPlanServiceCatalog =
    new TransportPlanServiceCatalog();
  @Input() editMode = false;
  @Output() transportProductEdited =
    new EventEmitter<TransportPlanServiceCatalog>();
  @Output() showDialog = new EventEmitter<boolean>();
  isFormSubmitted = false;
  displayDialog: boolean;
  title = "Modifier un Catalogue ";
  transportProductForm: FormGroup;
  transportProductCode: string;
  productList: Product[] = [];
  vats: Vat[];
  accountList: Account[] = [];
  transportList: Transport[] = [];
  subscriptions = new Subscription();
  selectDefaultVat : Vat= new Vat();
  constructor(
    private formBuilder: FormBuilder,
    private authentificationService: AuthenticationService,
    private transportProductService: TransportPlanServiceCatalogService,
    private productService: ProductServiceService,
    private vatService: VatService,
    private accountService: AccountService,
    private transportService: TransportServcie,
    private transportServiceService: TransportServiceService,
    private transportAccountServiceService: TransportAccountServiceService,
    private catalogSeviceService: CatalogServiceService,
    private accountPricingServiceService: AccountPricingServiceService,
    private catalogServiceService: CatalogServiceService
  ) {}

  ngOnInit() {
    console.log(this.type);

    this.subscriptions.add(
      this.vatService.findAll().subscribe((data: Vat[]) => {
        this.vats = data;
        this.selectDefaultVat= this.vats.filter(f=>f.id==4)[0]
      })
    );
console.log(this.selectedAccount);

    this.subscriptions.add(
      this.accountService
        .find("company.id:" + this.selectedAccount?.company?.id)
        .subscribe((data: Account[]) => {
          this.accountList = data;
        })
    );

    this.subscriptions.add(
      this.transportService.findAll().subscribe((data: Transport[]) => {
        this.transportList = data;
      })
    );

    this.displayDialog = true;
    console.log(this.editMode);

    if (!this.editMode) {
      this.title = "Ajouter un Catalogue";

      console.log("new");
    //  this.selectedTransportServiceCatalog = new TransportPlanServiceCatalog();
    } else {
      this.title = "Modifier un catalogue";
    }
    this.initForm();
    console.log(this.selectedTransportServiceCatalog);
  }

  initForm() {
    this.transportProductForm = this.formBuilder.group({
      product: this.formBuilder.control(
        this.selectedTransportServiceCatalog.product,
        Validators.required
      ),
      transport: this.formBuilder.control(
        this.selectedTransportServiceCatalog.transport
      ),

      account: this.formBuilder.control(
        this.selectedTransportServiceCatalog.account
      ),
      invoice: this.formBuilder.control(
        this.selectedTransportServiceCatalog.invoice
      ),
      dateService: this.formBuilder.control(
        new Date(this.selectedTransportServiceCatalog.dateService)
      ),
      purchasePriceHT: this.formBuilder.control(
        this.selectedTransportServiceCatalog.purchasePriceHT
      ),
      purchaseVat: this.formBuilder.control(
        this.selectedTransportServiceCatalog.purchaseVat
      ),
      purchasePriceTTC: this.formBuilder.control(
        this.selectedTransportServiceCatalog.purchasePriceTTC
      ),

      totalPurchasePriceHT: this.formBuilder.control(
        this.selectedTransportServiceCatalog.totalPurchasePriceHT
      ),
      totalPurchasePriceVat: this.formBuilder.control(
        this.selectedTransportServiceCatalog.totalPurchasePriceVat
      ),
      totalPurchasePriceTTC: this.formBuilder.control(
        this.selectedTransportServiceCatalog.totalPurchasePriceTTC
      ),
      quantity: this.formBuilder.control(
        this.selectedTransportServiceCatalog.quantity?this.selectedTransportServiceCatalog.quantity:1
      ),


    });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.transportProductForm.invalid) {
      return;
    }


   this.selectedTransportServiceCatalog.quantity = this.transportProductForm.value['quantity'];
    // this.selectedTransportServiceCatalog.code = this.transportProductCode;
    this.selectedTransportServiceCatalog.purchasePriceHT =
      this.transportProductForm.value["purchasePriceHT"];
    this.selectedTransportServiceCatalog.purchasePriceTTC =
      this.transportProductForm.value["purchasePriceTTC"];

      this.selectedTransportServiceCatalog.dateService =
      this.transportProductForm.value["dateService"];
      this.selectedTransportServiceCatalog.totalPurchasePriceHT =
      this.transportProductForm.value["totalPurchasePriceHT"];
      this.selectedTransportServiceCatalog.totalPurchasePriceVat =
      this.transportProductForm.value["totalPurchasePriceVat"];
    this.selectedTransportServiceCatalog.totalPurchasePriceTTC =
      this.transportProductForm.value["totalPurchasePriceTTC"];
    this.onSearchSalePriceServiceByAccount();


    this.selectedTransportServiceCatalog.owner =
      this.authentificationService.getDefaultOwner();
    console.log(this.selectedTransportServiceCatalog);

   this.transportProductEdited.emit(this.selectedTransportServiceCatalog);
    this.displayDialog = false;
  }

  productSearch(evt) {
    this.productService.find(`code~${evt.query}`).subscribe((data) => {
      this.productList = data;
    });
  }
  onSelectInvoice(event) {
    console.log(event.checked);

    this.selectedTransportServiceCatalog.invoice = event.checked;
  }
  onSelectAccount(event) {
    this.selectedTransportServiceCatalog.account = event.value;

    this.onSearchPurchasePriceServiceByAccount();

  }
  onSelectProduct(event) {
    this.selectedTransportServiceCatalog.product = event as Product;
    this.onSearchPurchasePriceServiceByAccount();


  }

  onSelectTransport(event) {
    this.selectedTransportServiceCatalog.transport = event.value;

    this.onSearchPurchasePriceServiceByAccount();
  }

  onSearchPurchasePriceServiceByAccount(){
    let requete;
    requete =
    "company.id:" +
        this.selectedAccount.company.id +
        ",transport.id:" +
        this.selectedTransportServiceCatalog.transport.id +
        ",product.id:" +
        this.selectedTransportServiceCatalog.product.id
        if(this.selectedTransportServiceCatalog?.account?.id != null || this.selectedTransportServiceCatalog?.account?.id !=undefined){
          requete+=",account.id:"+this.selectedTransportServiceCatalog.account.id;
       }
        console.log(requete);
    this.transportAccountServiceService
    .find(
    requete
    )
    .subscribe((data) => {
      if(this.selectedTransportServiceCatalog?.account?.id == null || this.selectedTransportServiceCatalog?.account?.id ==undefined){
        data= data.filter(f=> f.account==null);
   }
      if (data[0]) {
        console.log(data);

        console.log("account");
        this.initPurchase(
          data[0].purchaseAmountHt,
          data[0].purchaseAmountTtc,
          data[0].purchaseVat
        );
        this.onQuantityChange();
      } else {
        this.onSearchPriceServiceTransport();

      }
    });

  }

  onSearchPriceServiceTransport() {


          console.log("transport");

          this.transportServiceService
            .find(
              "transport.id:" +
                this.selectedTransportServiceCatalog.transport.id +
                ",product.id:" +
                this.selectedTransportServiceCatalog.product.id
            )
            .subscribe((data) => {
              if (data[0]) {
                this.initPurchase(
                  data[0].purchaseAmountHt,
                  data[0].purchaseAmountTtc,
                  data[0].purchaseVat
                );
                this.onQuantityChange();

              } else {
                this.initPurchase(0, 0, this.selectDefaultVat);
                this.onQuantityChange();
              }
            });

  }




  initPurchase(
    purchaseAmountht: number,
    purchaseAmountTtc: number,
    purchaseVat: Vat
  ) {
    console.log(purchaseVat);

    this.selectedTransportServiceCatalog.purchasePriceHT = purchaseAmountht;
    this.selectedTransportServiceCatalog.purchasePriceTTC = purchaseAmountTtc;

    this.selectedTransportServiceCatalog.purchaseVat = purchaseVat;
    this.initForm();
  }



  onSelectPurchaseVat(event) {
    let purchaseVat =  event.value;

    this.selectedTransportServiceCatalog.purchaseVat = purchaseVat;
    console.log(this.selectedTransportServiceCatalog.purchaseVat);
    this.onPriceChange(1);
  }



  onHideDialog() {
    const a = false;
    this.showDialog.emit(a);
    this.displayDialog = false;
  }

  onQuantityChange(){


    if (this.selectedTransportServiceCatalog.product == null) {
      return;
  }
  const price = +this.transportProductForm.value['purchasePriceHT'];

  const qty = +this.transportProductForm.value['quantity'];
  const vat =
      this.selectedTransportServiceCatalog.purchaseVat !== null &&
      this.selectedTransportServiceCatalog.purchaseVat !== null
          ? this.selectedTransportServiceCatalog?.purchaseVat?.value
          : 0;
          const amountTva = (price/100) * vat;
          console.log(price);
          console.log(vat);

          const priceTTC = price + amountTva;
          console.log(amountTva);

          console.log(priceTTC);

          this.selectedTransportServiceCatalog.totalPurchasePriceHT=Number((price * qty).toFixed(2))?Number((price * qty).toFixed(2)):0;
          this.selectedTransportServiceCatalog.totalPurchasePriceVat=Number(((price*qty/100) * vat).toFixed(2))?Number(((price*qty/100) * vat).toFixed(2)):0;
          this.selectedTransportServiceCatalog.totalPurchasePriceTTC=Number((priceTTC * qty).toFixed(2))?Number((priceTTC * qty).toFixed(2)):0;

          console.log(Number((priceTTC * qty).toFixed(2)));


  this.transportProductForm.patchValue({
    totalPurchasePriceHT: this.selectedTransportServiceCatalog.totalPurchasePriceHT,
    totalPurchasePriceTTC: this.selectedTransportServiceCatalog.totalPurchasePriceTTC,
    totalPurchasePriceVat: this.selectedTransportServiceCatalog.totalPurchasePriceVat

  });


  }

  onSaleChange(){
    console.log(this.selectedTransportServiceCatalog.salePriceHT);

    let salePriceHT = +this.selectedTransportServiceCatalog.salePriceHT;
   let amountTva=0;
   let salePriceTTC=0;
console.log(salePriceHT);


  const qty = +this.transportProductForm.value['quantity'];
  const vat =
      this.selectedTransportServiceCatalog.saleVat !== null &&
      this.selectedTransportServiceCatalog.saleVat !== null
          ? this.selectedTransportServiceCatalog?.saleVat?.value
          : 0;
          console.log(salePriceHT + "" + vat);

           amountTva =Number(((salePriceHT/100) * vat).toFixed(2));

          salePriceTTC = salePriceHT + amountTva;
          this.selectedTransportServiceCatalog.salePriceVat=amountTva;
          this.selectedTransportServiceCatalog.salePriceHT=salePriceHT;
          this.selectedTransportServiceCatalog.salePriceTTC=salePriceTTC;

          this.selectedTransportServiceCatalog.totalSalePriceVat=Number(((salePriceHT*qty/100) * vat).toFixed(2));
          this.selectedTransportServiceCatalog.totalSalePriceHT =Number ((salePriceHT * qty).toFixed(2));
          this.selectedTransportServiceCatalog.totalSalePriceTTC= Number ((salePriceTTC * qty).toFixed(2));


  }

  onPriceChange(n: Number) {
    let purchasePrice = +this.transportProductForm.value["purchasePriceHT"];
    let purchasePriceTTC = +this.transportProductForm.value["purchasePriceTTC"];
    let qty = +this.transportProductForm.value["quantity"];

    let purchaseVat = this.transportProductForm.value["purchaseVat"].value;

    if (purchasePrice === undefined || purchasePrice == null) {
      purchasePrice = 0;
    }
    if (purchasePriceTTC === undefined || purchasePriceTTC == null) {
      purchasePriceTTC = 0;
    }
    if (purchaseVat === undefined || purchaseVat == null) {
      purchaseVat = 0;
    }
      const amountTva = (purchasePrice / 100) * purchaseVat;


    if (n === 1) {
      const purchasePriceTTC = purchasePrice + amountTva;

      this.selectedTransportServiceCatalog.purchasePriceHT=purchasePrice?purchasePrice:0;
      this.selectedTransportServiceCatalog.purchasePriceTTC=Number(purchasePriceTTC.toFixed(2))?Number(purchasePriceTTC.toFixed(2)):0;
      this.selectedTransportServiceCatalog.purchasePriceVat=amountTva?amountTva:0;

      this.selectedTransportServiceCatalog.totalPurchasePriceHT=Number((purchasePrice * qty).toFixed(2),)?Number((purchasePrice * qty).toFixed(2),):0;
      this.selectedTransportServiceCatalog.totalPurchasePriceVat=Number(((purchasePrice*qty/100) * purchaseVat).toFixed(2));;
      this.selectedTransportServiceCatalog.totalPurchasePriceTTC=Number((purchasePriceTTC * qty).toFixed(2))?Number((purchasePriceTTC * qty).toFixed(2)):0;
      this.transportProductForm.patchValue({
        purchasePriceTTC: purchasePriceTTC.toFixed(2),
        totalPurchasePriceHT:   this.selectedTransportServiceCatalog.totalPurchasePriceHT,
        totalPurchasePriceTTC:this.selectedTransportServiceCatalog.totalPurchasePriceTTC ,
        totalPurchasePriceVat: this.selectedTransportServiceCatalog.totalPurchasePriceVat

      });

    }
    if (n === 2) {
      purchasePrice = purchasePriceTTC / (1 + purchaseVat / 100);

      this.selectedTransportServiceCatalog.purchasePriceHT=purchasePrice?purchasePrice:0;
      this.selectedTransportServiceCatalog.purchasePriceTTC=Number(purchasePriceTTC.toFixed(2))?Number(purchasePriceTTC.toFixed(2)):0;
      this.selectedTransportServiceCatalog.purchasePriceVat=amountTva?amountTva:0;

      this.selectedTransportServiceCatalog.totalPurchasePriceHT=Number((purchasePrice * qty).toFixed(2),)?Number((purchasePrice * qty).toFixed(2),):0;
      this.selectedTransportServiceCatalog.totalPurchasePriceVat=Number(((purchasePrice*qty/100) * purchaseVat).toFixed(2));;
      this.selectedTransportServiceCatalog.totalPurchasePriceTTC=Number((purchasePriceTTC * qty).toFixed(2))?Number((purchasePriceTTC * qty).toFixed(2)):0;


      this.transportProductForm.patchValue({
        purchasePriceHT: purchasePrice.toFixed(2),
        totalPurchasePriceHT: (purchasePrice * qty).toFixed(2),
        totalPurchasePriceTTC: (purchasePriceTTC * qty).toFixed(2)
      });

    }

  }









  onSearchSalePriceServiceByAccount() {

    let requete;
    requete =
      "company.id:" +
      this.selectedAccount.company.id +
      ",product.id:" +
      this.selectedTransportServiceCatalog.product.id+
      ",account.id:"+this.selectedAccount.id;

 console.log(requete);

    this.accountPricingServiceService
      .find(
      requete
      )
      .subscribe((data) => {
        console.log(data);
        if (data[0]) {
          console.log("accountService");
          console.log(data);

          this.selectedTransportServiceCatalog.salePriceHT=data[0].saleAmountHt;
          this.selectedTransportServiceCatalog.salePriceTTC=data[0].saleAmountTtc;
          this.selectedTransportServiceCatalog.saleVat=data[0].saleVat;
this.onSaleChange();
          // this.initSale(
          //   data[0].saleAmountHt,
          //   data[0].saleAmountTtc,
          //   data[0].saleVat
          // );
        } else {

          this.onSearchSalePriceServiceByCompany();
        }
      });
  }

 onSearchSalePriceServiceByCompany() {

    let requete;
    requete =
      "company.id:" +
      this.selectedAccount.company.id +
      ",product.id:" +
      this.selectedTransportServiceCatalog.product.id

 console.log(requete);

    this.accountPricingServiceService
      .find(
      requete
      )
      .subscribe((data) => {
        console.log(data);
              data= data.filter(f=> f.account==null);

        console.log(data);

        if (data[0]) {
          console.log("companyService");
          this.selectedTransportServiceCatalog.salePriceHT=data[0].saleAmountHt;
          this.selectedTransportServiceCatalog.salePriceTTC=data[0].saleAmountTtc;
          this.selectedTransportServiceCatalog.saleVat=data[0].saleVat;
          this.onSaleChange();

        } else {
          console.log("prixService");
          this.onSearchSalePriceServiceInCatalog();
        }
      });
  }

    onSearchSalePriceServiceInCatalog() {
    this.catalogServiceService
      .find("product.id:" + this.selectedTransportServiceCatalog.product.id)
      .subscribe((data) => {
        if (data[0]) {
          this.selectedTransportServiceCatalog.salePriceHT=data[0].saleAmountHt;
          this.selectedTransportServiceCatalog.salePriceTTC=data[0].saleAmountTtc;
          this.selectedTransportServiceCatalog.saleVat=data[0].saleVat;
          this.onSaleChange();

        } else {
          console.log("non");

          this.selectedTransportServiceCatalog.salePriceHT=this.selectedTransportServiceCatalog.purchasePriceHT?this.selectedTransportServiceCatalog.purchasePriceHT:0;
          this.selectedTransportServiceCatalog.salePriceTTC=this.selectedTransportServiceCatalog.purchasePriceTTC?this.selectedTransportServiceCatalog.purchasePriceTTC:0;
          this.selectedTransportServiceCatalog.saleVat=this.selectedTransportServiceCatalog.purchaseVat?this.selectedTransportServiceCatalog.purchaseVat:null;
          this.selectedTransportServiceCatalog.salePriceVat=this.selectedTransportServiceCatalog.purchasePriceVat?this.selectedTransportServiceCatalog.purchasePriceVat:0;
          this.onSaleChange();

        }
      });
  }


}
