import { TransportCategoryVehicleComponent } from "./../../../layouts/settings/transport-category-vehicle/transport-category-vehicle.component";
import { Observable } from "rxjs";
import { EmittedOBject } from "./emitted-object";
import { UserService } from "./../../services/api/user.service";
import { AuthenticationService } from "./../../services/api/authentication.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { User } from "./../../models/user";
import { MenuItem, ConfirmationService, SortEvent } from "primeng/api";
import { Columns } from "./../../models/column";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"]
})
export class DataTableComponent implements OnInit {

  @Input() permissionCreate :string[]=[];
  @Input() permissionEdit :string[]=[];
  @Input() permissionDelete :string[]=[];

  @Input() page = 0;
  @Input() size=0;
  @Input() collectionSize: number;
  @Input() objectList: Array<any> = [];
  @Input() objectExportList: Array<any> = [];
  @Input() _selectedColumns: Array<any> = [];
  @Input() cols: any[];
  @Input() className: String;
  @Input() listName: String;
  @Input() addBtnVisible = false;
  @Input() viewBtnVisible = false;
  @Input() updateBtnVisible = false;
  @Input() deleteBtnVisible = false;
  @Input() generateInvoiceBtnVisible = true;
  @Input() generateCancelPTBtnVisible = true;

  @Output() lazyLoadData = new EventEmitter<any>();
  @Output() objectEdited = new EventEmitter<EmittedOBject>();
  @Output() exportBtnExcelGlobal = new EventEmitter<any[]>();
  @Output() exportBtnExcelVue = new EventEmitter<any[]>();
  @Output() exportBtnPdf = new EventEmitter<any[]>();

  exportColumns: any[];
  columnsAdded: any[];
  columnsMapped: any[];
  exportBtnItems: MenuItem[];
  selectedObjects: Array<any> = [];
  user = new User();
  updateBtnDisable = false;
  deleteBtnDisable = false;
  generateInvoiceBtnDisable=false;
  generateCancelPTBtnDisable=false;

  items: MenuItem[];
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authUser: AuthenticationService,
    private userservice: UserService
  ) {}

  ngOnInit() {

    this.loadColumns();

    this.items = [

      {label: 'En PDF', icon: 'pi pi-file-pdf', command: () => {
          this.exportPdf();
      }},
      {label: 'En EXCEL Vue', icon: 'pi pi-file-excel', command: () => {
        this.exportExcelVue();
     }},
     {label: 'En EXCEL Globale', icon: 'pi pi-file-excel', command: () => {
      this.exportExcelGlobal();
     }},

  ];


  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  loadColumns() {
    this.user = this.authUser.getCurrentUser();


    if (this.user.columns != null && this.user.columns !== "") {
      this.columnsAdded = JSON.parse(this.user.columns);
      console.log("columnsAdded");

      console.log(this.columnsAdded);


      this.columnsMapped = this.columnsAdded.filter(
        tab => tab.classe === this.className
      );
      console.log("columnsMapped");

  console.log(this.columnsMapped);
      if (this.columnsMapped.length >= 1) {
        for (let i = 0; i < this.cols.length; i++) {
          for (let j = 0; j < this.columnsMapped.length; j++) {
            if (this.cols[i].field === this.columnsMapped[j].field) {
                     console.log(this.cols[i].field+"==="+  this.columnsMapped[j].field);

              if(this.columnsMapped[j].type=="object"){
                if (this.cols[i].child === this.columnsMapped[j].child) {
                  this.selectedColumns.push(this.cols[i]);

                }
              }

            else {
              this.selectedColumns.push(this.cols[i]);

            }
            }
          }
        }
        console.log("selectedColumns");

        console.log(this.selectedColumns);

        console.log("exist");

      } else {
        console.log("non");
        console.log("col");

        this.selectedColumns = this.cols;
      }
    } else {
      console.log("non");
      console.log("col");

      this.selectedColumns = this.cols;
    }

    this.exportColumns = this.selectedColumns.map(col => ({
      title: col.header,
      dataKey: col.field
    }));


  }
  typeOf(event) {
    let res: number;
    if (event === "object") {
      res = 1;
    } else if (event === "number" ) {
      res = 2;
    }
    else if ( event === "string") {
      res = 3;
    }  else if (event === "date") {
      res = 4;
    } else if (event === "boolean") {
      res = 5;
    }
    else if (event === "object2") {
      res = 6;
    }
    else if (event === "time") {
      res = 7;
    }


    return res;
  }

  exportExcelVue(): void {
    this.exportBtnExcelVue.emit(this.selectedColumns);
  }

  exportPdf(): void {
    this.exportBtnPdf.emit(this.selectedColumns);
  }

  exportExcelGlobal(): void {
    this.exportBtnExcelGlobal.emit(null);
  }

  onEdit(event) {
    this.objectEdited.emit({
      object: this.selectedObjects,
      operationMode: event
    });
    this.selectedObjects = [];
  }

  loadDataLazy(event) {
    // this.size = event.rows;
    // this.page = event.first / this.size;
    console.log(event);

    this.lazyLoadData.emit(event);
  }

  onRowSelect(event) {
    if (this.selectedObjects.length === 1) {
      this.updateBtnDisable = true;
      this.deleteBtnDisable = true;
      this. generateInvoiceBtnDisable=true;
      this. generateCancelPTBtnDisable=true;

    } else {
      this.updateBtnDisable = false;
      this. generateInvoiceBtnDisable=true;
      this. generateCancelPTBtnDisable=false;

    }

  }
  onRowUnselect(event) {
    if (this.selectedObjects.length === 1) {
      this.updateBtnDisable = true;
      this. generateInvoiceBtnDisable=true;
      this. generateCancelPTBtnDisable=true;


    } else if (this.selectedObjects.length < 1) {
      this.updateBtnDisable = false;
      this.deleteBtnDisable = false;
      this. generateInvoiceBtnDisable=false;
      this. generateCancelPTBtnDisable=false;

    }
  }

  onSaveView() {

    this.spinner.show();

console.log( this.columnsAdded);
if(this.columnsAdded!=undefined && this.columnsAdded!=null){
    this.columnsAdded = this.columnsAdded.filter(
      col => col.classe !== this.className
    );
}else {
  this.columnsAdded=[];
}

    for (let i = 0; i < this.selectedColumns.length; i++) {
      let c = new Columns();
      c.position = i;
      c.field = this.selectedColumns[i].field;
      c.header = this.selectedColumns[i].header;
      c.classe = this.className;
      c.type = this.selectedColumns[i].type;
      c.child = this.selectedColumns[i].child;
      this.columnsAdded.push(c);
    }


    this.user = this.authUser.getCurrentUser();
    this.user.columns = JSON.stringify(this.columnsAdded);
    this.authUser.setuser(this.user);
    this.userservice.set(this.user).subscribe(
      data => {
        this.toastr.success("La vue a été enregistrée avec Succés", "Edition");
      },
      error => {
        this.toastr.error(error.error.message, "Erreur");
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
}
