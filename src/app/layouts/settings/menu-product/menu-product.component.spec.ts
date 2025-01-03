import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuProductComponent } from './menu-product.component';

describe('MenuProductComponent', () => {
  let component: MenuProductComponent;
  let fixture: ComponentFixture<MenuProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
