import { Component, OnInit } from '@angular/core';
import { AgregarGastoComponent } from '../../components/agregar-gasto/agregar-gasto.component';
import { ListaPresupuestoComponent } from '../../components/lista-presupuesto/lista-presupuesto.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto.service';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-gasto',
  standalone: true,
  imports: [AgregarGastoComponent, ListaPresupuestoComponent, CommonModule, FormsModule, MenuComponent],
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.scss'
})
export class GastoComponent implements OnInit {

  presupuestos: any[] = [];
  selectedPresupuestoIndex: number | null = null;
  gastos: { monto: number; presupuesto: string }[] = [];
  error: boolean = false;
  gastoAgregado: number = 0;

  constructor(private presupuestoService: PresupuestoService) {}

  ngOnInit(): void {
    this.presupuestos = this.presupuestoService.getPresupuesto();
    if (this.presupuestos.length > 0) {
      this.selectedPresupuestoIndex = 0;
    }
    console.log('Presupuestos disponibles:', this.presupuestos);
  }

  get selectedPresupuesto() {
    return this.selectedPresupuestoIndex !== null
      ? this.presupuestos[this.selectedPresupuestoIndex]
      : null;
  }

  agregarGasto(gasto: number): void {
    if (this.selectedPresupuestoIndex === null || !this.selectedPresupuesto) {
      this.error = true;
      return;
    }

    console.log('Agregando gasto:', gasto, 'Presupuesto seleccionado:', this.selectedPresupuesto);

    const registrado = this.presupuestoService.registrarGasto(this.selectedPresupuestoIndex, gasto);
    if (!registrado) {
      this.error = true;
      return;
    }

    this.error = false;
    this.gastos.push({
      monto: gasto,
      presupuesto: this.selectedPresupuesto.nombre
    });
    this.gastoAgregado = gasto;
  }
}
