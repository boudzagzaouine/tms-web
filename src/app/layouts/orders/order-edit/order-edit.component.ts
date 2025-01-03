import { OrderStatusService } from './../../../shared/services/api/order-status.service';
import { OrderStatus } from './../../../shared/models/order-status';
import { Uom } from './../../../shared/models/uom';
import { UomService } from './../../../shared/services/api/uom.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PurchaseOrderService } from './../../../shared/services/api/purchase-order.service';
import { ConfirmationService } from 'primeng/api';
import { PurchaseOrderLine } from './../../../shared/models/purchase-order-line';
import { Vat } from './../../../shared/models/vat';
import { OrderTypeService } from './../../../shared/services/api/order-type.service';
import { OrderType } from './../../../shared/models/order-type';
import { SupplierService } from './../../../shared/services/api/supplier.service';
import { Supplier } from './../../../shared/models/supplier';
import { PurchaseOrder } from './../../../shared/models/purchase-order';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { VatService } from './../../../shared/services/api/vat.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../shared/services';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {

  size = 8;
  purchaseOrderForm: FormGroup;
  selectedPurchaseOrder: PurchaseOrder = new PurchaseOrder();
  selectedPurchaseOrderLine: PurchaseOrderLine = new PurchaseOrderLine();
 validate :number =0;
  isFormSubmitted = false;
  editModeTitle = 'Inserer une Commande';
  supplierList: Supplier[] = [];
  orderTypeList: OrderType[] = [];
  orderStatutList: OrderStatus[] = [];
  purchaseOrderLine=new PurchaseOrderLine;
  uomList: Uom[] = [];
  showDialog: boolean;
  editMode: boolean;
  subscrubtion = new Subscription();
  idLine :number=0;

  constructor(private supplierService: SupplierService,
    private purchaseOrderService: PurchaseOrderService,
    private orderTypeService: OrderTypeService,
    private orderStatutService: OrderStatusService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authentificationService :AuthenticationService,


  ) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.editModeTitle = 'Modifier une Commande';
      this.activatedRoute.params.subscribe(params => {
        id = params['id'];
        this.subscrubtion.add( this.purchaseOrderService.findById(id).subscribe(data => {
          this.selectedPurchaseOrder = data;


          this.initForm();
        },
          err => {
            this.toastr.error(err.error.message);
            this.spinner.hide();
          }));
      });
    } else {
      this.subscrubtion.add( this.orderTypeService.findAll().subscribe(
        data => {
          this.orderTypeList = data.filter(f => f.id === 1);
          this.selectedPurchaseOrder.orderType = this.orderTypeList[0];
        }
      ));
      this.subscrubtion.add( this.orderStatutService.findAll().subscribe(
        data => {
          this.orderStatutList = data.filter(f => f.id === 2);
          this.selectedPurchaseOrder.orderStatus = this.orderStatutList[0];
        }
      ));

      this.subscrubtion.add( this.purchaseOrderService.generateCode().subscribe(
        code => {
          this.selectedPurchaseOrder.code = code;
          this.initForm();
        }))
      this.initForm();
    }

    this.initForm();


  }

  initForm() {
    this.purchaseOrderForm = new FormGroup({

      code: new FormControl(
        {
          value:
            this.selectedPurchaseOrder != null &&
              this.selectedPurchaseOrder.code != null
              ? this.selectedPurchaseOrder.code
              : null,
          disabled: true
        },
        Validators.required
      ),
      supplier: new FormControl(

        this.selectedPurchaseOrder.supplier,


        Validators.required
      ),
      orderType: new FormControl({
        value:
        this.selectedPurchaseOrder.orderType != null
        ? this.selectedPurchaseOrder.orderType.code
        : null,
        disabled: true
      },
        Validators.required
      ),
      totalHt: new FormControl({
        value:
          this.selectedPurchaseOrder != null
            ? this.selectedPurchaseOrder.totalPriceHT
            : null,
        disabled: true
      }),
      vat: new FormControl({
        value:
          this.selectedPurchaseOrder != null
            ? this.selectedPurchaseOrder.vat
            : null,
        disabled: true
      }),
      statut: new FormControl(
        {
        value:
        this.selectedPurchaseOrder.orderStatus != null
        ? this.selectedPurchaseOrder.orderStatus.code
        : null,
          disabled: true
        }
      ),
      totalTTC: new FormControl({
        value:
          this.selectedPurchaseOrder != null
            ? this.selectedPurchaseOrder.totalPriceTTC
            : null,
        disabled: true
      }),

      notes: new FormControl(

        this.selectedPurchaseOrder.notes)

    });


  }
  onSubmit(close = false) {
    this.isFormSubmitted = true;
    if (this.purchaseOrderForm.invalid) {
      return;
    }

    this.selectedPurchaseOrder.notes = this.purchaseOrderForm.value['notes'];
    //this.selectedPurchaseOrder.code = this.purchaseOrderForm.value['code'];
    //this.selectedPurchaseOrder.orderType = this.purchaseOrderForm.value['orderType'];

    // this.selectedPurchaseOrder.orderType = this.purchaseOrderForm.value['orderType'];
 this.selectedPurchaseOrder.owner=this.authentificationService.getDefaultOwner();
    this.purchaseOrderService.set(this.selectedPurchaseOrder).subscribe(
      dataM => {
        this.toastr.success('Elément P est Enregistré Avec Succès', 'Edition');

        this.isFormSubmitted = false;
        this.spinner.hide();
        this.validate=1;


        if (close) {
         // this.router.navigate(['/core/order/list']);
        } else {

          this.router.navigate(['/core/order/edit']);
           this.selectedPurchaseOrder = new PurchaseOrder();
        this.purchaseOrderForm.reset();
        }

      },
      err => {
        this.toastr.error(err.error.message);
        this.spinner.hide();
        return;
      },
      () => {
        this.spinner.hide();
      }
    );


  }


  onSupplierCodeSearch(event: any) {

    this.subscrubtion.add(this.supplierService.find('contact.name~' + event.query).subscribe((data) => {
      this.supplierList = data;
    }));
  }

  onSelectOrderType(event) {
    this.selectedPurchaseOrder.orderType = event.value as OrderType;
  }
  onSelectSupplier(event) {
    this.selectedPurchaseOrder.supplier = event as Supplier;
  }

  onShowDialogAction(line,mode) {

    this.showDialog = true;
    if (mode == true) {
      this.selectedPurchaseOrderLine = line;
      this.editMode = true;
    } else {
      this.editMode = false;



    }
  }

  onDeleteMaintenanceLine(id: number) {
    this.confirmationService.confirm({
      message: 'Voulez vous vraiment Supprimer?',
      accept: () => {
        this.selectedPurchaseOrder.purshaseOrderLines = this.selectedPurchaseOrder.purshaseOrderLines.filter(
          (l) => l.id !== id
        );
        // this.updateTotalPrice();
      },
    });

  }

  onLineEditedAction(purchaseOrderLine: PurchaseOrderLine) {

    this.idLine--;


    this.selectedPurchaseOrder.purshaseOrderLines =
    this.selectedPurchaseOrder.purshaseOrderLines.sort(function (a, b) {
      return Number(a.number) - Number(b.number);
    });

    const orderline = this.selectedPurchaseOrder.purshaseOrderLines.find(
      line => line.product.id === purchaseOrderLine.product.id
    );

    const size = this.selectedPurchaseOrder.purshaseOrderLines.length;

    if (orderline == null) {

      if (size == 0) {
      purchaseOrderLine.number = 1000;
      } else {
            console.log(this.selectedPurchaseOrder.purshaseOrderLines[size-1].number);
        let lastLine =this.selectedPurchaseOrder.purshaseOrderLines[size-1].number ? this.selectedPurchaseOrder.purshaseOrderLines[size-1].number:0;
        purchaseOrderLine.number=lastLine+1000 ;
      }
      purchaseOrderLine.id=this.idLine;
      this.selectedPurchaseOrder.purshaseOrderLines.push(
        purchaseOrderLine
      );
    }
    this.selectedPurchaseOrder.totalPriceTTC = 0.0;
    this.selectedPurchaseOrder.totalPriceHT = 0.0;
    this.selectedPurchaseOrder.vat = 0.0;
    this.selectedPurchaseOrder.purshaseOrderLines.forEach(line => {
      this.selectedPurchaseOrder.totalPriceTTC += line.totalPriceTTC;
      this.selectedPurchaseOrder.totalPriceHT += line.totalPriceHT;
      this.selectedPurchaseOrder.vat +=
        line.totalPriceTTC - line.totalPriceHT;
    });

    if (this.purchaseOrderForm != null) {
      this.purchaseOrderForm.patchValue({
        totalHt: this.selectedPurchaseOrder.totalPriceHT,
        vat: this.selectedPurchaseOrder.vat,
        totalTTC: this.selectedPurchaseOrder.totalPriceTTC
      });
      this.purchaseOrderForm.updateValueAndValidity();
    }


  }

  onHideDialogAction(event) {
    this.showDialog = event;
  }

  ngOnDestroy() {
    this.subscrubtion.unsubscribe();
  }
}
