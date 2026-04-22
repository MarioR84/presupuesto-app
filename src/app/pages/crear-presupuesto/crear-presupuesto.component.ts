import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PresupuestoService } from '../../services/presupuesto.service';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-crear-presupuesto',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent], // 👈 CLAVE
  templateUrl: './crear-presupuesto.component.html'
})
export class CrearPresupuestoComponent {

  presupuesto: number | null = null;
  error: boolean = false;

  constructor(
    private presupuestoService: PresupuestoService,
    private router: Router
  ) {}

  guardarPresupuesto() {
    const presupuestoActual = Number(this.presupuesto ?? 0);

    if (presupuestoActual <= 0) {
      this.error = true;
      return;
    }

    this.error = false;

    this.presupuestoService.setPresupuestoInicial(presupuestoActual);
    this.presupuestoService.limpiarPresupuestos();

    this.router.navigate(['/administrar']);
  }
}