import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto.service';

@Component({
  selector: 'app-form-presupuesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-presupuesto.component.html'
})
export class FormPresupuestoComponent {

  nombre: string = '';
  mes: string = '';
  monto: number | null = null;
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  error: string = '';
  exito: string = '';

  constructor(private presupuestoService: PresupuestoService) {}

  guardar() {
    this.error = '';
    this.exito = '';

    const montoActual = Number(this.monto ?? 0);

    if (!this.nombre.trim() || !this.mes.trim() || montoActual <= 0) {
      this.error = 'Completa todos los campos y usa un monto mayor a 0.';
      return;
    }

    const nuevo = {
      nombre: this.nombre,
      mes: this.mes,
      monto: montoActual,
      restante: montoActual
    };

    const resultado = this.presupuestoService.setPresupuesto(nuevo);
    if (!resultado.ok) {
      this.error = resultado.error ?? 'No se pudo guardar el presupuesto.';
      return;
    }

    this.exito = resultado.accion === 'acumulado'
      ? 'Presupuesto existente actualizado y monto acumulado correctamente.'
      : 'Presupuesto guardado correctamente.';
    this.nombre = '';
    this.mes = '';
    this.monto = null;
  }

}