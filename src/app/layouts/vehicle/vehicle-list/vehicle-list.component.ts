import { VehicleCategory } from './../../../shared/models/vehicle-category';
import { BadgeType } from './../../../shared/models/badge-Type';
import { Router } from '@angular/router';
import { Vehicle } from './../../../shared/models/vehicle';
import { ToastrService } from 'ngx-toastr';
import { BadgeTypeService } from './../../../shared/services/api/badge-type.service';
import { VehicleCategoryService } from './../../../shared/services/api/vehicle-category.service';
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmsBuffer } from './../../../shared/utils/ems-buffer';
import { VehicleService } from './../../../shared/services';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
  providers: [ConfirmationService]
})
export class VehicleListComponent implements OnInit {

  page = 0;
  size = 10;
  collectionSize: number;
  searchQuery = '';
  codeSearch: string;
  matSearch: string;
  categorySearch: string;
  badgeTypeSearch: string;
  transportSearch: string;
  contratTypeSearch: string;
  selectedVehicles: Array<Vehicle> = [];
  vehicleList: Array<Vehicle> = [];
  vehicleCategoryList: Array<VehicleCategory> = [];
  badgeTypeList: Array<BadgeType> = [];
  transportList: Array<Transport> = [];
  contratTypeList: Array<Transport> = [];
  className: String;
  cols: any[];
  editMode: number;
  showDialog: boolean;

  constructor(private vehicleService: VehicleService,
    private vehicleCategoryService: VehicleCategoryService,
    private badgeTypeService: BadgeTypeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {

    this.className = Vehicle.name;
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'registrationNumber', header: 'Immatriculation' },
      { field: 'vehicleCategory', header: 'Catégorie véhicule' },
      { field: 'badgeType', header: 'Type de bage' },
      { field: 'technicalVisit', header: 'Date du contrôle technique' },
      { field: 'valueTechnicalVisit', header: 'Montant du contrôle technique' },
      { field: 'vignette', header: 'Date De Paiment de la vignette' },
      { field: 'valueVignette', header: 'Montant vignette' },
      { field: 'grayCard', header: 'Carte grise' },
      { field: 'chassisNumber', header: ' Numéro chassis' },
      { field: 'numberCylinder', header: 'Nombre de cylindres' },
      { field: 'fiscalPower', header: 'Puissance fiscal' },
      { field: 'body', header: 'Carrosserie' },
      { field: 'consumptionType', header: 'Type de consommation' },
      { field: 'engineOil', header: 'Huile moteur' },
      { field: 'rearDeck', header: 'Pont arriere' },
      { field: 'direction', header: 'Direction' },
      { field: 'radiator', header: 'Radiateur' },
      { field: 'airFilter', header: 'Filtre à air' },
      { field: 'gearBox', header: 'Boite a vitesse' },
      { field: 'desiccantFilter', header: 'Filtre dissicateur' },
      { field: 'contractType', header: 'Type de contrat' },
      { field: 'aquisitionDate', header: 'Date aquisition' },
      { field: 'amount', header: 'Montant' },
      { field: 'transport', header: 'Transport' },



    ];
  }


  loadData(search: string = '') {
    this.spinner.show();
    this.vehicleService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.vehicleService.findPagination(this.page, this.size, search).subscribe(
      data => {
        console.log(data);
        this.vehicleList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
  loadDataLazy(event) {
    this.page = event.first / this.size;
    this.loadData(this.searchQuery);
  }

  onSearchClicked() {

    const buffer = new EmsBuffer();
    if (this.codeSearch != null && this.codeSearch !== '') {
      buffer.append(`code~${this.codeSearch}`);
    }

    if (this.matSearch != null && this.matSearch !== '') {
      buffer.append(`registrationNumber~${this.matSearch}`);
    }

    if (this.categorySearch != null && this.categorySearch !== '') {
      buffer.append(`vehicleCategory.code~${this.categorySearch}`);
    }

    if (this.badgeTypeSearch != null && this.badgeTypeSearch !== '') {
      buffer.append(`badgeType.code~${this.badgeTypeSearch}`);
    }
    if (this.transportSearch != null && this.transportSearch !== '') {
      buffer.append(`transport.code~${this.transportSearch}`);
    }

    if (this.contratTypeSearch != null && this.contratTypeSearch !== '') {
      buffer.append(`contratType.code~${this.contratTypeSearch}`);
    }


    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }


  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectedVehicles = event.object;

    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
      this.router.navigate(['/core/vehicles/edit', this.selectedVehicles[0].id]);
    }

  }

  onVehicleCategorySearch(event: any) {
    this.vehicleCategoryService.find('code~' + event.query).subscribe(
      data => this.vehicleCategoryList = data.map(f => f.code)
    );
  }

  onBadgeTypeSearch(event: any) {
    this.badgeTypeService.find('code~' + event.query).subscribe(
      data => this.badgeTypeList = data.map(f => f.code)
    );
  }

  onContratTypeSearch(event: any) {
    this.badgeTypeService.find('code~' + event.query).subscribe(
      data => this.contratTypeList = data.map(f => f.code)
    );
  }
  onTransportSearch(event: any) {
    this.badgeTypeService.find('code~' + event.query).subscribe(
      data => this.transportList = data.map(f => f.code)
    );
  }

  reset() {
    this.codeSearch = null;
    this.matSearch = null;
    this.categorySearch = null;
    this.badgeTypeSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }


  onDeleteAll() {

    if (this.selectedVehicles.length >= 1) {
      this.confirmationService.confirm({
        message: 'Voulez vous vraiment Suprimer?',
        accept: () => {
          const ids = this.selectedVehicles.map(x => x.id);
          this.vehicleService.deleteAllByIds(ids).subscribe(
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
    } else if (this.selectedVehicles.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }
  }

}
