import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BadgeType } from '../../../../shared/models';
import { BadgeTypeService } from '../../../../shared/services';

@Component({
  selector: 'app-badge-type-edit',
  templateUrl: './badge-type-edit.component.html',
  styleUrls: ['./badge-type-edit.component.css']
})
export class BadgeTypeEditComponent implements OnInit {

  @Input() selectedBadgeType = new BadgeType();
  @Input() editMode: boolean;
  closeResult: String;
  badgeTypeForm: FormGroup;
  badgeTypeTypeList: BadgeType[] = [];

  modal: NgbModalRef;

  constructor(
    private badgeTypeService: BadgeTypeService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.initForm();

  }

  initForm() {
    this.badgeTypeForm = new FormGroup({
      'code': new FormControl(this.selectedBadgeType.code),
      'description': new FormControl(this.selectedBadgeType.description)
    });
  }
  onSubmit() {
    this.selectedBadgeType.code = this.badgeTypeForm.value['code'];
    this.selectedBadgeType.description = this.badgeTypeForm.value['description'];


    console.log(this.selectedBadgeType);
    const s = this.badgeTypeService.set(this.selectedBadgeType);

    if (this.modal) { this.modal.close(); }
  }

  open(content) {
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
