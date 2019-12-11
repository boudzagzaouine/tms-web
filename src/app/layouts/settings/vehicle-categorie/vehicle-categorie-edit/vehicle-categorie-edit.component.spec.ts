import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCategorieEditComponent } from './vehicle-categorie-edit.component';

describe('VehicleCategorieEditComponent', () => {
  let component: VehicleCategorieEditComponent;
  let fixture: ComponentFixture<VehicleCategorieEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCategorieEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCategorieEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});