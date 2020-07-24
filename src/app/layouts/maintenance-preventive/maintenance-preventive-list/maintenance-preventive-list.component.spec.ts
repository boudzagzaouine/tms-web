import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePreventiveListComponent } from './maintenance-preventive-list.component';

describe('MaintenancePreventiveListComponent', () => {
  let component: MaintenancePreventiveListComponent;
  let fixture: ComponentFixture<MaintenancePreventiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenancePreventiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePreventiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});