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
import { Product } from './../../../../shared/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  @Input() selectedProduct: Product;
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();
  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un produit';
  productForm: FormGroup;
  vats: Vat[];
  uoms: Uom[];
  productTypeList: ProductType[];
  subscriptions = new Subscription();

  constructor(
    private productTypeService: ProductTypeService,
    private productService: ProductService,
    private vatService: VatService,
    private uomService: UomService,

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

    if (this.editMode === 1) {
      this.selectedProduct = new Product();
      this.title = 'Ajouter un produit';

    } 

    this.displayDialog = true;
    this.initForm();

 console.log(this.productForm.value);
 
  }

  initForm() {

    this.productForm = new FormGroup({
      code: new FormControl(this.selectedProduct.code,Validators.required),
      description: new FormControl(this.selectedProduct.desc),
      type: new FormControl(this.selectedProduct.productType,Validators.required),
      uom: new FormControl( this.selectedProduct.uomByProductUomBase,Validators.required),
      purchaseVat: new FormControl(this.selectedProduct.purchaseVat,Validators.required ),
      purchasePrice: new FormControl(this.selectedProduct.purshasePriceUB,Validators.required),
      purchasePriceTTC: new FormControl(this.selectedProduct.purshasePriceTTCUB,Validators.required),
      qntStock: new FormControl(this.selectedProduct.stockQuantity),

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

    this.selectedProduct.active = true;

     console.log(this.selectedProduct);

     this.subscriptions.add(this.productService.set(this.selectedProduct).subscribe(
      data => {
          this.toastr.success('Elément Enregistré Avec Succès', 'Edition');
          this.displayDialog = false;
          this.isFormSubmitted = false;
          this.spinner.hide();
        },
      error => {
        this.toastr.error(error.error.message);
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

  this.productForm.patchValue({
      uom: this.selectedProduct.uomByProductUomBase
  });
}


onSelectPurchaseVat(event) {
  this.selectedProduct.purchaseVat = event.value as Vat;

  this.onPriceChange(1);

}





onPriceChange(n: Number) {
  let purchasePrice = +this.productForm.value['purchasePrice'];
  let purchasePriceTTC = +this.productForm.value['purchasePriceTTC'];
  let vatPurchase: Vat = this.productForm.value['purchaseVat'];

  if (purchasePrice === undefined || purchasePrice == null) {
    purchasePrice = 0;
  } if (purchasePriceTTC === undefined || purchasePriceTTC == null) {
    purchasePriceTTC = 0;
  } if (vatPurchase.value === undefined || vatPurchase.value == null) {
    vatPurchase.value = 0;
  }

  if (n === 1) {
    const amountTva = (purchasePrice / 100) * vatPurchase.value;
    const priceTTC = purchasePrice + amountTva;
    this.productForm.patchValue({
      'purchasePriceTTC': priceTTC.toFixed(2),
    });
  }if (n === 2) {
      purchasePrice = purchasePriceTTC / (1 + vatPurchase.value / 100);
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
