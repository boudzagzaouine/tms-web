import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MachineService } from './../../../shared/services/api/machine.service';
import { Machine } from './../../../shared/models/machine';
import { EmsBuffer } from './../../../shared/utils/ems-buffer';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  page = 0;
  size = 10;
  collectionSize: number;
  searchQuery = '';
  codeSearch: string;
  selectedMachines: Array<Machine> = [];
  maachineList: Array<Machine> = [];
  className: String;
  cols: any[];
  editMode: number;
  showDialog: boolean;

  constructor(private machineService: MachineService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {

    this.className = Machine.name;
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'consumptionType', header: 'Type de consommation' },
      { field: 'contractType', header: 'Type de contrat' },
      { field: 'aquisitionDate', header: 'Date aquisition' },
      { field: 'amount', header: 'Montant' },
      { field: 'transport', header: 'Transport' },



    ];
  }


  loadData(search: string = '') {
    this.spinner.show();
    this.machineService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.machineService.findPagination(this.page, this.size, search).subscribe(
      data => {
        console.log(data);
        this.maachineList = data;
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


    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }


  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectedMachines = event.object;

    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
      this.router.navigate(['/core/machine/edit', this.selectedMachines[0].id]);
    }

  }

  reset() {
    this.codeSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }


  onDeleteAll() {

    if (this.selectedMachines.length >= 1) {
      this.confirmationService.confirm({
        message: 'Voulez vous vraiment Suprimer?',
        accept: () => {
          const ids = this.selectedMachines.map(x => x.id);
          this.machineService.deleteAllByIds(ids).subscribe(
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
    } else if (this.selectedMachines.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }
  }

}