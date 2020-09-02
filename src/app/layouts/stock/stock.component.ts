import { ProductTypeService } from './../../shared/services/api/product-type.service';
import { ProductType } from './../../shared/models/product-type';
import { UomService } from './../../shared/services/api/uom.service';
import { SupplierService } from './../../shared/services/api/supplier.service';
import { ProductService } from './../../shared/services/api/product.service';
import { Supplier } from './../../shared/models/supplier';
import { Product } from './../../shared/models/product';
import { EmsBuffer } from './../../shared/utils/ems-buffer';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from './../../shared/services/api/global.service';
import { StockService } from './../../shared/services/api/stock.service';
import { Stock } from './../../shared/models/stock';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  page = 0;
  size = 5;
  collectionSize: number;
  searchQuery = '';
  codeSearch: string;
  productSearch: Product;
  supplierSearch: Supplier;
  productCodeList: Array<Product> = [];
  supplierCodeList: Array<Supplier> = [];
  productTypeSearch: ProductType;
  productTypeCodeList: Array<ProductType> = [];
  descriptionSearch = '';
  codeList: Array<Stock> = [];
  cols: any[];
  stockList: Array<Stock> = [];
  selectedStock: Array<Stock> = [];
  showDialog: boolean;
  editMode: number;
  className: string;
  titleList = 'List du Stock';
  stockExportList: Array<Stock> = [];

  constructor(private stockService: StockService,
    private productService : ProductService,
  private supplierService : SupplierService,
  private productTypeService :ProductTypeService,
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {

    this.productTypeService.findAll().subscribe(
      data => this.productTypeCodeList = data ,
    );
    this.className = Stock.name;
    this.cols = [
      {
        field: 'product',child: 'code',   header: 'Produit',    type: 'object'
      },
      {
        field: 'uom',child: 'code',   header: 'Unité de mesure',    type: 'object'
      },

      {
        field: 'quantity',   header: 'Quantité',    type: 'number'
      },
      {
        field: 'receptionDate',   header: 'Date de reception',    type: 'date'
      },

    ];

    this.loadData();

  }
  onExportExcel(event) {

    this.stockService.find(this.searchQuery).subscribe(
      data => {
        this.stockExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.stockExportList, this.className, this.titleList);
        } else {
          this.globalService.generateExcel(this.cols, this.stockExportList, this.className, this.titleList);

        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );


  }
  onExportPdf(event) {
    this.stockService.find(this.searchQuery).subscribe(
      data => {
        this.stockExportList = data;
        this.globalService.generatePdf(event, this.stockExportList, this.className, this.titleList);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );

  }
  loadData(search: string = '') {
    this.spinner.show();
    this.stockService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.stockService.findPagination(this.page, this.size, search).subscribe(
      data => {
        console.log(data);
        this.stockList = data;

        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.error.message, 'Erreur');
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData(this.searchQuery);
  }

  onSearchClicked() {
    const buffer = new EmsBuffer();
    if (this.productSearch != null && this.productSearch.code !== '') {
      buffer.append(`product.code~${this.productSearch.code}`);
    }
    if (this.productTypeSearch != null && this.productTypeSearch.code !== '') {
      buffer.append(`productType.code~${this.productTypeSearch.code}`);
    }
    if (this.supplierSearch != null && this.supplierSearch.code !== '') {
      buffer.append(`supplier.code~${this.supplierSearch.code}`);
    }
    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }
  onCodeSearch(event: any) {
    this.stockService.find('code~' + event.query).subscribe(
      data => this.codeList = data.map(f => f.code)
    );
  }
  reset() {
    this.productSearch = null;
    this.productTypeSearch = null;
    this.supplierSearch = null;

    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }

  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectedStock = event.object;
    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
    }

  }

  onDeleteAll() {

    if (this.selectedStock.length >= 1) {
      this.confirmationService.confirm({
        message: 'Voulez vous vraiment Suprimer?',
        accept: () => {
          const ids = this.selectedStock.map(x => x.id);
          this.stockService.deleteAllByIds(ids).subscribe(
            data => {
              this.toastr.success('Elément Supprimer avec Succés', 'Suppression');
              this.loadData();
            },
            error => {
              this.toastr.error(error.error.message, 'Erreur');
            },
            () => this.spinner.hide()
          );
        }
      });
    } else if (this.selectedStock.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }


  }


  onProductCodeSearch(event: any) {
    this.productService.find('code~' + event.query).subscribe(
      data => this.productCodeList = data ,
    );
  }
  onProductTypeCodeSearch(event: any) {
    this.productTypeService.find('code~' + event.query).subscribe(
      data => this.productTypeCodeList = data ,
    );
  }
  onSupplierCodeSearch(event: any) {
    this.supplierService.find('code~' + event.query).subscribe(
      data => this.supplierCodeList = data ,
    );
  }
  onShowDialog(event) {

    this.showDialog = event;

    this.loadData();
  }
}