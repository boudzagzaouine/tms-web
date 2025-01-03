import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService, PrimeNGConfig, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Agent } from './../../../shared/models/agent';
import { AgentService } from './../../../shared/services/api/agent.service';
import { GlobalService } from './../../../shared/services/api/global.service';
import { EmsBuffer } from './../../../shared/utils';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  page = 0;
  size = 5;
  collectionSize: number;
  searchQuery = '';
  codeSearch: string;
  descriptionSearch = '';
  codeList: Array<Agent> = [];
  cols: any[];
  agentList: Array<Agent> = [];
  selectedAgents: Array<Agent> = [];
  showDialog: boolean;
  editMode: number;
  className: string;
  titleList = 'Liste des Agents';
  agentExportList: Array<Agent> = [];
  subscriptions= new Subscription();
  items: MenuItem[];
  home: MenuItem;
  constructor(private agentService: AgentService,
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.className = Agent.name;
    this.cols = [
      { field: 'code', header: 'Code', type: 'string' },
      { field: 'name', header: 'Nom', type: 'string' },
      { field: 'cin', header: 'Cin', type: 'string' },
      { field: 'birthDate', header: 'Date Naissance', type: 'date' },
      { field: 'tele1', header: 'Téléphone', type: 'string' },
      { field: 'responsability', child:'code',header: 'Responsabilité', type: 'object' },
    ];
    this.items = [
      {label: 'Paramétrage'},
      {label: 'Agent' ,routerLink:'/core/settings/agents'},

  ];
    this.loadData();

  }
  onExportExcel(event) {

    this.subscriptions.add(this.agentService.find(this.searchQuery).subscribe(
      data => {
        this.agentExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.agentExportList, this.className, this.titleList);
        } else {
          this.globalService.generateExcel(this.cols, this.agentExportList, this.className, this.titleList);

        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));


  }
  onExportPdf(event) {
    this.subscriptions.add(this.agentService.find(this.searchQuery).subscribe(
      data => {
        this.agentExportList = data;
        this.globalService.generatePdf(event, this.agentExportList, this.className, this.titleList);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));

  }
  loadData(search: string = '') {
    this.spinner.show();
    this.subscriptions.add(this.agentService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.agentService.findPagination(this.page, this.size, search).subscribe(
      data => {
        this.agentList = data;

        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});

      //  this.toastr.error(error.error.message, 'Erreur');
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }
  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData(this.searchQuery);
  }

  onSearchClicked() {
    const buffer = new EmsBuffer();
    if (this.codeSearch != null && this.codeSearch !== '') {
      buffer.append(`code~${this.codeSearch}`);
    }
    if (this.descriptionSearch != null && this.descriptionSearch !== '') {
      buffer.append(`description~${this.descriptionSearch}`);
    }
    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }
  onCodeSearch(event: any) {
    this.subscriptions.add(this.agentService.find('code~' + event.query).subscribe(
      data => this.codeList = data.map(f => f.code)
    ));
  }
  reset() {
    this.codeSearch = null;
    this.descriptionSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }

  onObjectEdited(event) {

    this.editMode = event.operationMode;
    this.selectedAgents = event.object;
    if (this.editMode === 3) {
      this.onDeleteAll();
    } else {
      this.showDialog = true;
    }

  }

  onDeleteAll() {

    if (this.selectedAgents.length >= 1) {
      this.confirmationService.confirm({
        message: ' Voulez vous vraiment Supprimer  ?',
        accept: () => {
          const ids = this.selectedAgents.map(x => x.id);
          this.subscriptions.add(this.agentService.deleteAllByIds(ids).subscribe(
            data => {
              //this.toastr.success('Elément Supprimer avec Succés', 'Suppression');
              this.messageService.add({severity:'success', summary: 'Suppression', detail: 'Elément Supprimer avec Succés'});

              this.loadData();
            },
            error => {
              this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});

             // this.toastr.error(error.error.message, 'Erreur');
            },
            () => this.spinner.hide()
          ));
        }
      });
    } else if (this.selectedAgents.length < 1) {
      this.toastr.warning('aucun ligne sélectionnée');
    }


  }

  onShowDialog(event) {

    this.showDialog = event;

    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
