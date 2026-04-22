import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-presupuesto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-presupuesto.component.html'
})
export class ListaPresupuestoComponent {
  @Input() presupuestoInicial: number = 0;
  @Input() restante: number = 0;

  getColor(): string {
    const porcentaje = this.presupuestoInicial > 0 ? this.restante / this.presupuestoInicial : 0;
    if (porcentaje <= 0.25) {
      return 'text-danger';
    }
    if (porcentaje <= 0.5) {
      return 'text-warning';
    }
    return 'text-success';
  }
}
