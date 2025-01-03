import { ProductService } from './../../../../shared/services/api/product.service';
import { VatService } from './../../../../shared/services/api/vat.service';
import { UomService } from './../../../../shared/services/api/uom.service';
import { Uom } from './../../../../shared/models/uom';
import { Vat } from './../../../../shared/models/vat';
import { ProductTypeService } from './../../../../shared/services/api/product-type.service';
import { ProductType } from './../../../../shared/models/product-type';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from './../../../../shared/services/api/supplier.service';
import { Address } from './../../../../shared/models/address';
import { Contact } from './../../../../shared/models/contact';
import { Supplier } from './../../../../shared/models/supplier';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Product, ProductPack } from './../../../../shared/models';
import { Subscription } from 'rxjs';
import { ProductPackService } from './../../../../shared/services/api/product-pack.service';
import { AuthenticationService } from './../../../../shared/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  @Input() selectedProduct: Product;
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();
  selectProductPack = new ProductPack()

  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un produit';
  productForm: FormGroup;
  vats: Vat[];
  uoms: Uom[];
  productTypeList: ProductType[];
  subscriptions = new Subscription();
  editMd :boolean;
  vat = new Vat();
  constructor(
    private productTypeService: ProductTypeService,
    private authentificationService:AuthenticationService,
    private productPackService: ProductPackService,
    private productService: ProductService,
    private vatService: VatService,
    private uomService: UomService,
    private messageService: MessageService,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.subscriptions.add(this.productTypeService.findAll().subscribe((data: ProductType[]) => {
      this.productTypeList = data;
  }));
  this.subscriptions.add(this.vatService.findAll().subscribe((data: Vat[]) => {
      this.vats = data;
    }));

    this.subscriptions.add(this.uomService.findAll().subscribe((data: Uom[]) => {
      this.uoms = data;


    }));
    this.editMd=true;

    if (this.editMode === 1) {
      this.selectedProduct = new Product();
      this.title = 'Ajouter un produit';
      this.editMd=false;

    }
console.log(this.selectedProduct);

    this.displayDialog = true;
    this.initForm();

    console.log(this.selectedProduct);



  }

  initForm() {

    this.productForm = new FormGroup({
      code: new FormControl(this.selectedProduct.code,Validators.required),
      description: new FormControl(this.selectedProduct.desc),
      type: new FormControl(this.selectedProduct.productType,Validators.required),
      uom: new FormControl( this.selectedProduct.uomByProductUomBase,Validators.required),
      vat: new FormControl(
        this.editMode!=1 ?this.selectedProduct.vat.value
        :this.selectedProduct.vat,Validators.required ),
      purchasePrice: new FormControl(this.selectedProduct.purshasePriceUB,Validators.required),
      purchasePriceTTC: new FormControl(this.selectedProduct.purshasePriceTTCUB,Validators.required),
      qntStock: new FormControl(this.selectedProduct.stockQuantity),
      qntMin: new FormControl(this.selectedProduct.minStock),
      component :new FormControl(this.selectedProduct.component),

  });

  }
  onSubmit() {

    this.isFormSubmitted = true;
    if (this.productForm.invalid) { return; }

    this.spinner.show();
    this.selectedProduct.code = this.productForm.value['code'];
    this.selectedProduct.desc = this.productForm.value['description'];
    this.selectedProduct.purshasePriceUB = +this.productForm.value[
        'purchasePrice'
    ];
    this.selectedProduct.purshasePriceTTCUB = +this.productForm.value[
      'purchasePriceTTC'
  ];
  this.selectedProduct.uomByProductUomBase = this.productForm.value[
    'uom'
  ];
  this.selectedProduct.minStock = this.productForm.value[
    'qntMin'
  ];
  this.selectedProduct.service=false;
  if (this.productForm.value['component'] === true) {
    this.selectedProduct.component = true;
  } else {
    this.selectedProduct.component = false;
  }
    this.selectedProduct.active = true;
  //this.selectedProduct.vat== this.vats.filter(f=> f.value== this.productForm.value['vat'])[0];;
    this.selectedProduct.owner=this.authentificationService.getDefaultOwner();
    this.selectProductPack.uom=this.selectedProduct.uomByProductUomBase;
    this.selectProductPack.quantity=1;

    //console.log(this.selectedProduct);

     this.subscriptions.add(this.productService.set(this.selectedProduct).subscribe(
      dataP => {
        this.messageService.add({severity:'success', summary: 'Edition', detail: 'Elément Enregistré Avec Succès'});

         // this.toastr.success('Elément Enregistré Avec Succès', 'Edition');
          this.displayDialog = false;
          this.isFormSubmitted = false;
          this.spinner.hide();
        },
      error => {
        this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});

      //  this.toastr.error(error.error.message);
        this.spinner.hide();
      },

      () => this.spinner.hide()
    ));


  }

  onSearchProduct(event: any) {
    this.subscriptions.add(this.productTypeService.find(`code~${event.query}`).subscribe(
        data => {
            this.productTypeList = data;
        }
    ));
}

onSelectProductType(type: ProductType) {

  this.selectedProduct.productType = type as ProductType;

}
onSelectUom(event) {

  this.selectedProduct.uomByProductUomBase = event.value as Uom;
  this.selectedProduct.uomByProductUomPurshase = event.value as Uom;
  this.selectedProduct.uomByProductUomSale = event.value as Uom;

 /* this.productForm.patchValue({
      uom: this.selectedProduct.uomByProductUomBase
  });*/

}


onSelectVat(event : Vat) {
  this.vat= this.vats.filter(f=> f.value== event.value)[0];

  this.selectedProduct.vat = this.vat;
  //console.log(this.vat);

  this.onPriceChange(1);

}





onPriceChange(n: Number) {
  let purchasePrice = +this.productForm.value['purchasePrice'];
  let purchasePriceTTC = +this.productForm.value['purchasePriceTTC'];
  let vat = this.productForm.value['vat'];

  if (purchasePrice === undefined || purchasePrice == null) {
    purchasePrice = 0;
  } if (purchasePriceTTC === undefined || purchasePriceTTC == null) {
    purchasePriceTTC = 0;
  } if (vat === undefined || vat == null) {
    vat = 0;
  }

  if (n === 1) {
    const amountTva = (purchasePrice / 100) * vat;
    const priceTTC = purchasePrice + amountTva;
    this.productForm.patchValue({
      'purchasePriceTTC': priceTTC.toFixed(2),
    });
  }if (n === 2) {
      purchasePrice = purchasePriceTTC / (1 + vat / 100);
      this.productForm.patchValue({
          purchasePrice: purchasePrice.toFixed(2)
      });
  }

}



  onShowDialog() {
    let a = false;
    this.showDialog.emit(a);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
