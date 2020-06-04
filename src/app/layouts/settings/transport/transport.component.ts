import { EmsBuffer } from './../../../shared/utils/ems-buffer';
import { Transport } from './../../../shared/models/transport';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransportServcie } from './../../../shared/services/api/transport.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  page = 0;
  size = 5;
  collectionSize: number;
  searchQuery = '';
  nameSearch: string;
  descriptionSearch = '';
  nameList: Array<Transport> = [];
  cols: any[];
  zoneList: Array<Transport> = [];
  selectedTransports: Array<Transport> = [];
  showDialog: boolean;
  editMode: number;
  className: String;

  constructor(private tranportService: TransportServcie,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {

    this.className = Transport.name;
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Nom' },
      { field: 'description', header: 'Description' },
      { field: 'line1', header: 'Adrress 1' },
      { field: 'line2', header: 'Address 2' },
      { field: 'zip', header: 'Code Postale' },
      { field: 'city', header: 'Ville' },
      { field: 'address.country', header: 'Pays' },
    ];

    this.loadData();

  }

  loadData(search: string = '') {
    this.spinner.show();
    this.tranportService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.tranportService.findPagination(this.page, this.size, search).subscribe(
      data => {
        console.log(data);
        this.zoneList = data;

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
    if (this.nameSearch != null && this.nameSearch !== '') {
      buffer.append(`name~${this.nameSearch}`);
    }

    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }
  onNameSearch(event: any) {
    this.tranportService.find('name~' + event.query).subscribe(
      data => this.nameList = data.map(f => f.name)
    );
  }
  reset() {
    this.nameSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }

  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectedTransports = event.object;
    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
    }

  }

  onDeleteAll() {

    if (this.selectedTransports.length >= 1) {
      this.confirmationService.confirm({
        message: 'Voulez vous vraiment Suprimer?',
        accept: () => {
          const ids = this.selectedTransports.map(x => x.id);
          this.tranportService.deleteAllByIds(ids).subscribe(
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
    } else if (this.selectedTransports.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }


  }

  onShowDialog(event) {
    this.showDialog = event;
    this.loadData();
  }


}