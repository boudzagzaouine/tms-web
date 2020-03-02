import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionDriverEditComponent } from './commission-driver-edit.component';

describe('CommissionDriverEditComponent', () => {
  let component: CommissionDriverEditComponent;
  let fixture: ComponentFixture<CommissionDriverEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionDriverEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionDriverEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});