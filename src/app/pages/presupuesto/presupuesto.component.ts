import { Component } from '@angular/core';
import { ListaPresupuestosComponent } from '../../components/lista-presupuestos/lista-presupuestos.component';
import { FormPresupuestoComponent } from '../../components/form-presupuesto/form-presupuesto.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  imports: [ListaPresupuestosComponent, FormPresupuestoComponent, MenuComponent], // 👈 CLAVE
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent {}
