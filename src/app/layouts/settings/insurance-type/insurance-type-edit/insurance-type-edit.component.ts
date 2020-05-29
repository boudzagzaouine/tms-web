import { element } from 'protractor';
import { Driver } from './../../../../shared/models/driver';
import { InsuranceTypeTerms } from './../../../../shared/models/insurance-type-terms';
import { InsuranceTypeTermsService } from './../../../../shared/services/api/insurance-type-term.service';
import { InsuranceTermService } from './../../../../shared/services/api/insurance-term.service';
import { InsuranceTerm } from './../../../../shared/models/insurance-term';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { InsuranceTypeService } from './../../../../shared/services/api/insurance-type.service';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InsuranceType } from './../../../../shared/models/insurance-Type';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-insurance-type-edit',
  templateUrl: './insurance-type-edit.component.html',
  styleUrls: ['./insurance-type-edit.component.css']
})
export class InsuranceTypeEditComponent implements OnInit {


  @Input() selectedinsuranceType = new InsuranceType();
  @Input() editMode: number;
  @Input() insertOrUpdate: String;
  @Output() insuranceTypeAdded = new EventEmitter<InsuranceType>();
  @Output() showDialog = new EventEmitter<boolean>();
  page = 0;
  size = 5;
  searchQuery: string;
  insuranceTypeForm: FormGroup;
  selectInsurannceTypeTerms: any;
  insuranceTypeTermsList: Array<InsuranceTypeTerms> = [];
  insuranceTypeTermsListC: Array<InsuranceTypeTerms> = [];
  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un type assurance';
  constructor(
    private insuranceTypeService: InsuranceTypeService,
    private insuranceTypeTermsService: InsuranceTypeTermsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.open();
    this.displayDialog = true;
    this.initForm();


  }

  initForm() {
    this.insuranceTypeForm = new FormGroup({
      'code': new FormControl(this.selectedinsuranceType.code, Validators.required),
      'description': new FormControl(this.selectedinsuranceType.description)
    });
  }

  onDeleteLine(insuranceTerms: InsuranceTypeTerms) {
    this.insuranceTypeTermsList = this.insuranceTypeTermsList.filter(
      p => p.insuranceTerm.id !== insuranceTerms.insuranceTerm.id);
  }

  onLineEdited(insuranceTerms: InsuranceTypeTerms) {
    this.insuranceTypeTermsList = this.insuranceTypeTermsList.filter(
      p => p.insuranceTerm.id !== insuranceTerms.insuranceTerm.id);
    this.insuranceTypeTermsList.push(insuranceTerms);
  }

  onSubmit() {
    if (this.insuranceTypeForm.invalid) { return; }
    this.spinner.show();
    this.selectedinsuranceType.code = this.insuranceTypeForm.value['code'];
    this.selectedinsuranceType.description = this.insuranceTypeForm.value['description'];
    this.insuranceTypeService.set(this.selectedinsuranceType).subscribe(
      dataIt => {
        this.insuranceTypeAdded.emit(dataIt);
        console.log(dataIt);
        if (this.editMode) {

          this.insuranceTypeTermsListC.forEach(eleme => {
            this.insuranceTypeTermsService.delete(eleme.id).subscribe(
              d => {
              }
            );
          });
        }
        if (this.insuranceTypeTermsList.length) {
          this.insuranceTypeTermsList.forEach(
            elemen => {
              this.selectInsurannceTypeTerms = new InsuranceTypeTerms(dataIt, elemen.insuranceTerm, elemen.amount);
              this.insuranceTypeTermsService.set(this.selectInsurannceTypeTerms).subscribe(
                data => {
                });
            });

        }
        this.toastr.success('Elément Enregistré avec succès', 'Edition');
        this.displayDialog = false;
        this.isFormSubmitted = false;
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.error.message);
        console.log(error);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  open() {
    this.insuranceTypeTermsList = [];
    if (this.editMode === 1) {
      this.selectedinsuranceType = new InsuranceType();
      this.title = 'Ajouter un type assurance';
    } else {

      this.insuranceTypeTermsService.findAllPagination(this.page, this.size).subscribe(
        data => {
          this.insuranceTypeTermsList = data;
          this.insuranceTypeTermsList = this.insuranceTypeTermsList.filter(
            p =>
              ((p.insuranceType.id === this.selectedinsuranceType.id))
          );
          this.insuranceTypeTermsListC = this.insuranceTypeTermsList;
          this.spinner.hide();
        },
      );

    }
    this.initForm();

  }

  onShowDialog() {
    let a = false;
    this.showDialog.emit(a);
  }
}
