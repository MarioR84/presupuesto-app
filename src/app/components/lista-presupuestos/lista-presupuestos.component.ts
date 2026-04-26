import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MontoPipe } from '../../pipes/monto.pipe';
import { PresupuestoService } from '../../services/presupuesto.service';

@Component({
  selector: 'app-lista-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, MontoPipe],
  templateUrl: './lista-presupuestos.component.html',
  styleUrl: './lista-presupuestos.component.scss'
})
export class ListaPresupuestosComponent {
  montosExtra: number[] = [];
  montosGasto: number[] = [];
  justificaciones: string[] = [];
  erroresGasto: (string | null)[] = [];
  exitosGasto: boolean[] = [];

  constructor(public presupuestoService: PresupuestoService) {}

  getMesesPresupuesto(p: any): string {
    return this.presupuestoService.getMesesDisplay(p);
  }

  getColor(p: any): string {
    if (p.monto === 0) return 'text-muted';
    const pct = p.restante / p.monto;
    if (pct <= 0.25) return 'text-danger';
    if (pct <= 0.5) return 'text-warning';
    return 'text-success';
  }

  agregarMonto(index: number): void {
    const montoExtra = Number(this.montosExtra[index] ?? 0);
    if (montoExtra <= 0) return;
    const actualizado = this.presupuestoService.agregarMonto(index, montoExtra);
    if (actualizado) {
      this.montosExtra[index] = 0;
    }
  }

  agregarGasto(index: number): void {
    const monto = Number(this.montosGasto[index] ?? 0);
    const justificacion = (this.justificaciones[index] ?? '').trim();

    if (monto <= 0) {
      this.erroresGasto[index] = 'Ingrese un monto válido';
      this.exitosGasto[index] = false;
      return;
    }
    if (!justificacion) {
      this.erroresGasto[index] = 'Ingrese una justificación';
      this.exitosGasto[index] = false;
      return;
    }

    const ok = this.presupuestoService.registrarGasto(index, monto, justificacion);
    if (!ok) {
      this.erroresGasto[index] = 'El gasto supera el presupuesto restante';
      this.exitosGasto[index] = false;
      return;
    }

    this.erroresGasto[index] = null;
    this.exitosGasto[index] = true;
    this.montosGasto[index] = 0;
    this.justificaciones[index] = '';
    setTimeout(() => { this.exitosGasto[index] = false; }, 2500);
  }

  eliminar(index: number): void {
    this.presupuestoService.eliminarPresupuesto(index);
    this.montosExtra.splice(index, 1);
    this.montosGasto.splice(index, 1);
    this.justificaciones.splice(index, 1);
    this.erroresGasto.splice(index, 1);
    this.exitosGasto.splice(index, 1);
  }
}
