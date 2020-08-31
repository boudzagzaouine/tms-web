import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionLineEditComponent } from './reception-line-edit.component';

describe('ReceptionLineEditComponent', () => {
  let component: ReceptionLineEditComponent;
  let fixture: ComponentFixture<ReceptionLineEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionLineEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionLineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
