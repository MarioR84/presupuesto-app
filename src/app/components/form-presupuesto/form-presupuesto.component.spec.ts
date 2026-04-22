import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPresupuestoComponent } from './form-presupuesto.component';

describe('FormPresupuestoComponent', () => {
  let component: FormPresupuestoComponent;
  let fixture: ComponentFixture<FormPresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPresupuestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
