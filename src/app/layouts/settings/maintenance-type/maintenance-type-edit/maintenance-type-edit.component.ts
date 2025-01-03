import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MaintenanceTypeService } from './../../../../shared/services/api/maintenance-type.service';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaintenanceType } from './../../../../shared/models/maintenance-type';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../../shared/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-maintenance-type-edit',
  templateUrl: './maintenance-type-edit.component.html',
  styleUrls: ['./maintenance-type-edit.component.css']
})
export class MaintenanceTypeEditComponent implements OnInit {

  @Input() selectedMaintenanceType = new MaintenanceType();
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();
  maintenanceTypeForm: FormGroup;
  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un type de maintenance';
  subscriptions= new Subscription();


  constructor(private maintenanceTypeService: MaintenanceTypeService,
   private authentificationservice:AuthenticationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private toastr: ToastrService) { }

  ngOnInit() {

    if (this.editMode === 1) {
      this.selectedMaintenanceType = new MaintenanceType();
      this.title = 'Ajouter un type de maintenance';
    }

    this.displayDialog = true;
    this.initForm();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.maintenanceTypeForm.invalid) {
      return;
    }


    this.selectedMaintenanceType.code = this.maintenanceTypeForm.value['code'];
    this.selectedMaintenanceType.description = this.maintenanceTypeForm.value['description'];
  this.selectedMaintenanceType.owner=this.authentificationservice.getDefaultOwner();
    this.subscriptions.add(this.maintenanceTypeService.set(this.selectedMaintenanceType).subscribe(
      data => {
        this.messageService.add({severity:'success', summary: 'Edition', detail: 'Elément est Enregistré avec succès'});

        //this.toastr.success('Elément est Enregistré avec succès', 'Edition');
        this.displayDialog = false;
        this.isFormSubmitted = false;
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Erreur'});

       // this.toastr.error(error.error.message );
       // console.log(error);
        this.spinner.hide();
      },

      () => this.spinner.hide()
    ));
  }
  initForm() {
    this.maintenanceTypeForm = new FormGroup({
      'code': new FormControl(this.selectedMaintenanceType.code, Validators.required),
      'description': new FormControl(this.selectedMaintenanceType.description)
    });
  }



  onShowDialog() {
    let a = false;
    this.showDialog.emit(a);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
