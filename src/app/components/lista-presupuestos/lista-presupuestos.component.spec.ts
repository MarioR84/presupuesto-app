import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPresupuestosComponent } from './lista-presupuestos.component';

describe('ListaPresupuestosComponent', () => {
  let component: ListaPresupuestosComponent;
  let fixture: ComponentFixture<ListaPresupuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPresupuestosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPresupuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
