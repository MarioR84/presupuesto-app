import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-gasto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-gasto.component.html'
})
export class AgregarGastoComponent {

  gasto: number = 0;
  error: boolean = false;

  @Output() nuevoGasto = new EventEmitter<number>(); // 👈 CLAVE

  agregar() {

    if (this.gasto <= 0) {
      this.error = true;
      return;
    }

    this.error = false;

    console.log('Emitiendo gasto:', this.gasto, 'Tipo:', typeof this.gasto);
    this.nuevoGasto.emit(Number(this.gasto)); // 👈 Asegurar que sea number
    this.gasto = 0;
  }
}