import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresupuestoService } from '../../services/presupuesto.service';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  presupuestoInicial: number = 0;
  presupuestos: any[] = [];
  gastoTotal: number = 0;
  cantidadPresupuestos: number = 0;
  presupuestoTotal: number = 0;
  presupuestoRestante: number = 0;

  constructor(private presupuestoService: PresupuestoService) {}

  ngOnInit(): void {
    this.presupuestos = this.presupuestoService.getPresupuesto();
    this.cantidadPresupuestos = this.presupuestos.length;
    this.presupuestoInicial = this.presupuestoService.getPresupuestoInicial();
    this.calcularGastos();
    this.calcularTotales();
  }

  calcularGastos(): void {
    this.gastoTotal = this.presupuestos.reduce((total, p) => {
      return total + (Number(p.monto) - Number(p.restante));
    }, 0);
  }

  calcularTotales(): void {
    if (this.presupuestos.length > 0) {
      this.presupuestoTotal = this.presupuestos.reduce((total, p) => total + Number(p.monto), 0);
      this.presupuestoRestante = this.presupuestos.reduce((total, p) => total + Number(p.restante), 0);
    } else {
      this.presupuestoTotal = 0;
      this.presupuestoRestante = 0;
    }
  }

  getPorcentajeUsado(): number {
    if (this.presupuestoTotal === 0) return 0;
    return (this.gastoTotal / this.presupuestoTotal) * 100;
  }

  getMesesPresupuesto(p: any): string {
    if (Array.isArray(p.meses) && p.meses.length > 0) {
      return p.meses.join(', ');
    }

    if (typeof p.mes === 'string' && p.mes.trim()) {
      return p.mes;
    }

    return 'Sin meses registrados';
  }

  /** Retorna color según porcentaje restante (success/warning/danger) */
  getColorClass(p: any): string {
    const pct = p.monto > 0 ? p.restante / p.monto : 0;
    if (pct <= 0.25) return 'danger';
    if (pct <= 0.5) return 'warning';
    return 'success';
  }
}