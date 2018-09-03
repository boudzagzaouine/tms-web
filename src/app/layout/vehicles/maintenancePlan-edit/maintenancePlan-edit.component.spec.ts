import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlanComponent } from './maintenancePlan-edit.component';

describe('MaintenancePlan-editComponent', () => {
  let component: MaintenancePlanComponent;
  let fixture: ComponentFixture<MaintenancePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenancePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
