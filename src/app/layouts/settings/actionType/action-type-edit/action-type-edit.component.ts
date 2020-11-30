import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActionType } from './../../../../shared/models/action-type';
import { ActionTypeService } from '../../../../shared/services/api/action-type.service';

@Component({
  selector: 'app-action-type-edit',
  templateUrl: './action-type-edit.component.html',
  styleUrls: ['./action-type-edit.component.scss']
})
export class ActionTypeEditComponent implements OnInit {

  @Input() selectedActionType = new ActionType();
  @Input() editMode: number;
  @Output() showDialog = new EventEmitter<boolean>();

  actionTypeForm: FormGroup;
  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un type action';
  subscriptions= new Subscription();

  constructor(private actionTypeService: ActionTypeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {


    if (this.editMode === 1) {
      this.selectedActionType = new ActionType();
      this.title = 'Ajouter un type action';
    }

    this.displayDialog = true;
    this.initForm();


  }

  initForm() {
    this.actionTypeForm = new FormGroup({
      'code': new FormControl(this.selectedActionType.code, Validators.required),
      'description': new FormControl(this.selectedActionType.description),
    });
  }


  onSubmit() {
    this.isFormSubmitted = true;
    if (this.actionTypeForm.invalid) { return; }
    this.spinner.show();
    this.selectedActionType.code = this.actionTypeForm.value['code'];
    this.selectedActionType.description = this.actionTypeForm.value['description'];

    this.subscriptions.add( this.actionTypeService.set(this.selectedActionType).subscribe(
      data => {
        this.toastr.success('Elément est Enregistré avec succès', 'Edition');
        // this.loadData();
        this.displayDialog = false;
        this.isFormSubmitted = false;
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.error.message, 'Erreur');
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));

  }
  onShowDialog() {
    let a = false;
    this.showDialog.emit(a);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}