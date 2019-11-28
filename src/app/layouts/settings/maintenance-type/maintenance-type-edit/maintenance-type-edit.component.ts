import { MaintenanceTypeService } from './../../../../shared/services/api/maintenance-type.service';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaintenanceType } from './../../../../shared/models/maintenance-type';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-maintenance-type-edit',
  templateUrl: './maintenance-type-edit.component.html',
  styleUrls: ['./maintenance-type-edit.component.css']
})
export class MaintenanceTypeEditComponent implements OnInit {

  @Input() selectedMaintenanceType = new MaintenanceType();
  @Input() editMode: boolean;
  closeResult: String;
  maintenanceTypeForm: FormGroup;
  maintenanceTypeList: MaintenanceType[] = [];
submitted=false;
  modal: NgbModalRef;


  constructor(private maintenanceTypeService: MaintenanceTypeService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.maintenanceTypeService.findAll().subscribe(
      data => {
        this.maintenanceTypeList = data;
      }
    );

    this.initForm();
  }

  onSubmit() {
    this.submitted=true;
    if (this.maintenanceTypeForm.invalid) {
      return;
  }
    this.selectedMaintenanceType.code = this.maintenanceTypeForm.value['code'];
    this.selectedMaintenanceType.description = this.maintenanceTypeForm.value['description'];


    console.log(this.selectedMaintenanceType);
    const s = this.maintenanceTypeService.set(this.selectedMaintenanceType);

    if (this.modal) { this.modal.close(); }
  }
  initForm() {
    this.maintenanceTypeForm = new FormGroup({
      'code': new FormControl(this.selectedMaintenanceType.code,Validators.required),
      'description': new FormControl(this.selectedMaintenanceType.description)
    });
  }
  open(content) {
   if(!this.editMode){

       this.selectedMaintenanceType=new MaintenanceType();
       this.initForm();
   }

    this.modal = this.modalService.open(content, { backdrop: 'static', centered: true, size: 'sm' });
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}