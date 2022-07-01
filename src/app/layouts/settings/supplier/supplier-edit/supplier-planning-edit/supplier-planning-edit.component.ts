import { Day } from './../../../../../shared/models/day';
import { DayService } from './../../../../../shared/services/api/day.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Planning } from './../../../../../shared/models/planning';
import { AuthenticationService } from './../../../../../shared/services';

@Component({
  selector: 'app-supplier-planning-edit',
  templateUrl: './supplier-planning-edit.component.html',
  styleUrls: ['./supplier-planning-edit.component.scss']
})
export class SupplierPlanningEditComponent implements OnInit {


  @Input() selectedPlanning: Planning = new Planning();
  @Input() editMode = false;
  @Output() planningEdited = new EventEmitter<Planning>();
  @Output() showDialog = new EventEmitter<boolean>();

  isFormSubmitted = false;
  displayDialog: boolean;
  title = 'Modifier un Plan';
  planningForm: FormGroup;
  planningDays: Array<Day> = [];

  // planningDays: Array<{ day: string }> = [];

  constructor(
    private formBuilder: FormBuilder,
    private authentificationService: AuthenticationService,
    private dayService:DayService,

  ) { }

  ngOnInit() {

   // this.planningDays = [ { day: 'LUNDI' }, { day: 'MARDI' }, { day: 'MERCREDI' }, { day: 'JEUDI' }, { day: 'Vendredi' }, { day: 'SAMEDI' }, { day: 'DIMANCHE' },]

    this.displayDialog = true;

    this.title = 'Modifier un Plan';


      this.dayService.findAll().subscribe((data) => {
        this.planningDays = data.sort(function (a, b) {
          return (Number(a.value) - Number(b.value))
        });

      })



    if (!this.editMode) {

      this.title = 'Ajouter un Plan';

      this.selectedPlanning = new Planning();
      this.selectedPlanning.everingTimeStart.setHours(0,0,0);
      this.selectedPlanning.everingTimeEnd.setHours(0,0,0);
      this.selectedPlanning.morningTimeStart.setHours(0,0,0);
     this.selectedPlanning.morningTimeEnd.setHours(0,0,0);

    }
    else{

    }
    this.initForm();



  }

  onChangeClosing(event){
if(event.checked==true){
  this.selectedPlanning.closingDay=true;
  const  date =new Date();
date.setHours(0,0,0);
  this.planningForm.patchValue({
    morningstart: date,
    morningend:  date,
    everingstart:date,
    everingend:date,
  });

  this.planningForm.updateValueAndValidity();

}else {
  this.selectedPlanning.closingDay=false;
}
  }

  initForm() {
    let mstart = new Date(this.selectedPlanning.morningTimeStart);
    let mend = new Date(this.selectedPlanning.morningTimeEnd);
    let estart = new Date(this.selectedPlanning.everingTimeStart);
    let eend = new Date(this.selectedPlanning.everingTimeEnd);

    this.planningForm = this.formBuilder.group({

      day: this.formBuilder.control(this.selectedPlanning.day),
      morning: this.formBuilder.control(this.selectedPlanning.morning),
      morningstart: this.formBuilder.control(mstart),
      morningend: this.formBuilder.control(mend),
      evering: this.formBuilder.control(this.selectedPlanning.morning),
      everingstart: this.formBuilder.control(estart),
      everingend: this.formBuilder.control(eend),
      closingday: this.formBuilder.control(this.selectedPlanning.closingDay),

    });
  }


  onSubmit() {
    this.isFormSubmitted = true;
    if (this.planningForm.invalid) {
      return;
    }

    // this.selectedPlanning.Day = this.planningForm.value['day'];
  //  this.selectedPlanning.morning = "Matin";
    this.selectedPlanning.morningTimeStart = this.planningForm.value['morningstart'];
    this.selectedPlanning.morningTimeEnd = this.planningForm.value['morningend'];
   // this.selectedPlanning.evering = "Soir";
    this.selectedPlanning.everingTimeStart = this.planningForm.value['everingstart'];
    this.selectedPlanning.everingTimeEnd = this.planningForm.value['everingend'];
    this.selectedPlanning.closingDay = this.planningForm.value['closingday'];
console.log(this.selectedPlanning.closingDay);

    this.selectedPlanning.owner = this.authentificationService.getDefaultOwner();

    this.planningEdited.emit(this.selectedPlanning);
    this.displayDialog = false;

  }


  onSelectDay(event:Day) {
 this.dayService.findById(event.value).subscribe(data=>{
this.selectedPlanning.day = data;

 });

    //
  }


  onHideDialog() {
    const a = false;
    this.showDialog.emit(a);
    this.displayDialog = false;

  }



}
