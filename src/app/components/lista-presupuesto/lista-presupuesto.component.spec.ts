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
presupuestoService: any;

  getColor(): string {

  if (this.restante > this.presupuestoInicial * 0.5) {
    return 'text-success'; // verde
  } 
  else if (this.restante > this.presupuestoInicial * 0.25) {
    return 'text-warning'; // amarillo
  } 
  else {
    return 'text-danger'; // rojo
  }
} 
}