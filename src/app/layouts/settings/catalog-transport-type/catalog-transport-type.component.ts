import { Zone } from './../../../shared/models/Zone';
import { Transport } from './../../../shared/models/transport';
import { VehicleCategory } from './../../../shared/models/vehicle-category';
import { ZoneServcie } from './../../../shared/services/api/zone.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransportServcie } from './../../../shared/services/api/transport.service';
import { VehicleCategoryService } from './../../../shared/services/api/vehicle-category.service';
import { CatalogTransportTypeServcie } from './../../../shared/services/api/Catalog-Transport-Type.service';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { CatalogTransportType } from './../../../shared/models/CatalogTransportType';
import { EmsBuffer } from './../../../shared/utils/ems-buffer';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog-transport-type',
  templateUrl: './catalog-transport-type.component.html',
  styleUrls: ['./catalog-transport-type.component.css']
})
export class CatalogTransportTypeComponent implements OnInit {

  page = 0;
  size = 10;
  collectionSize: number;

  selectCatalogTransportTypes: Array<CatalogTransportType> = [];
  searchQuery = '';
  codeSearch: string;
  vehicleCategorySearch: VehicleCategory;
  transportSearch: Transport;
  transportCatVehicleList: Array<CatalogTransportType> = [];
  categorieVehicleList: Array<VehicleCategory> = [];
  transportList: Array<Transport> = [];

  zoneSourceSearch: Zone;
  zoneDestinationSearch: Zone;
  zoneSourceList: Array<Zone> = [];

  cols: any[];
  showDialog: boolean;
  editMode: number;
  className: String;

  constructor(private catalogTransportTypeService: CatalogTransportTypeServcie,
    private vehicleCategoryService: VehicleCategoryService,
    private zoneService: ZoneServcie,
    private transportService: TransportServcie,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.className = CatalogTransportType.name;
    this.cols = [
      { field: 'transport', header: 'Transport' },
      { field: 'vehicleCategory', header: 'Catégorie de Véhicle' },
      { field: 'zoneSource', header: 'Zone Source' },
      { field: 'zoneDestination', header: 'Zone Destination' },
      { field: 'amountHt', header: 'Montant Ht' },
      { field: 'amountTtc', header: 'Montant TTC' },
      { field: 'amountTva', header: 'Montant' },
      { field: 'vat', header: 'TVA' },
    ];

    this.loadData();

    this.vehicleCategoryService.findAll().subscribe(
      data => {
        this.categorieVehicleList = data;
      }
    );

    this.transportService.findAll().subscribe(
      data => {
        this.transportList = data;
      }
    );

    this.zoneService.findAll().subscribe(
      data => {
        this.zoneSourceList = data;

      }
    );

  }


  loadData() {

    console.log(`search query : ${this.searchQuery}`);

    this.spinner.show();
    this.catalogTransportTypeService.sizeSearch(this.searchQuery).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.catalogTransportTypeService.findPagination(this.page, this.size, this.searchQuery).subscribe(
      data => {
        console.log(data);
        this.transportCatVehicleList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Erreur de connexion');
      },
      () => this.spinner.hide()
    );
  }
  loadDataLazy(event) {
    this.page = event.first / this.size;
    console.log('first : ' + event.first);
    this.loadData();
  }

  onSearchClicked() {

    const buffer = new EmsBuffer();
    if (this.codeSearch != null && this.codeSearch !== '') {
      buffer.append(`code~${this.codeSearch}`);
    }

    if (this.vehicleCategorySearch != null && this.vehicleCategorySearch.code !== '') {
      buffer.append(`vehicleCategory.code~${this.vehicleCategorySearch.code}`);
    }
    if (this.transportSearch != null && this.transportSearch.code !== '') {
      buffer.append(`transport.code~${this.transportSearch.code}`);
    }
    if (this.zoneSourceSearch != null && this.zoneSourceSearch.name !== '') {
      buffer.append(`zoneSource.name~${this.zoneSourceSearch.name}`);
    }
    if (this.zoneDestinationSearch != null && this.zoneDestinationSearch.name !== '') {
      buffer.append(`zoneDestination.name~${this.zoneDestinationSearch.name}`);
    }

    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData();

  }

  onCategoryVehicleSearch(event: any) {
    this.vehicleCategoryService.find('code~' + event.query).subscribe(
      data => this.categorieVehicleList = data.map(f => f.code)
    );
  }
  onTransportSearch(event: any) {
    this.transportService.find('code~' + event.query).subscribe(
      data => this.transportList = data.map(f => f.code)
    );
  }

  reset() {
    this.transportSearch = null;
    this.vehicleCategorySearch = null;
    this.zoneSourceSearch = null;
    this.zoneDestinationSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData();
  }


  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectCatalogTransportTypes = event.object;
    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
    }

  }

  onDeleteAll() {

    if (this.selectCatalogTransportTypes.length >= 1) {
      this.confirmationService.confirm({
        message: 'Voulez vous vraiment Suprimer?',
        accept: () => {
          const ids = this.selectCatalogTransportTypes.map(x => x.id);
          this.catalogTransportTypeService.deleteAllByIds(ids).subscribe(
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
    } else if (this.selectCatalogTransportTypes.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }


  }

  onShowDialog(event) {
    this.showDialog = event;
    this.loadData();
  }

}
