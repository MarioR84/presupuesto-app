import { Component, OnInit } from '@angular/core';
import { ListaPresupuestoComponent } from "../../components/lista-presupuesto/lista-presupuesto.component";
import { AgregarGastoComponent } from "../../components/agregar-gasto/agregar-gasto.component";
import { NgIf, NgFor } from "@angular/common";
import { PresupuestoService } from '../../services/presupuesto.service';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-administrar-presupuesto',
  templateUrl: './administrar-presupuesto.component.html',
  styleUrls: ['./administrar-presupuesto.component.scss'],
  imports: [ListaPresupuestoComponent, AgregarGastoComponent, NgIf, NgFor, MenuComponent]
})
export class AdministrarPresupuestoComponent implements OnInit {

  presupuesto: number = 5000;  // valor inicial
  restante: number = 5000;
  colorClase: string = 'text-success'; // verde inicial
  gasto: number = 0; // input de gasto
  error: boolean = false; // control de error si gasto > restante
  gastos: number[] = []; // array para almacenar los gastos

  constructor(private presupuestoService: PresupuestoService) {}

  ngOnInit(): void {
    const presupuestoGuardado = this.presupuestoService.getPresupuestoInicial();
    if (presupuestoGuardado > 0) {
      this.presupuesto = presupuestoGuardado;
      this.restante = presupuestoGuardado;
    }
    this.actualizarColor();
  }

  // Actualiza color según porcentaje restante
  actualizarColor(): void {
    const porcentaje = this.restante / this.presupuesto;
    if (porcentaje <= 0.25) this.colorClase = 'text-danger';
    else if (porcentaje <= 0.5) this.colorClase = 'text-warning';
    else this.colorClase = 'text-success';
  }

  // Se llama al cambiar el presupuesto inicial
  actualizarPresupuesto(): void {
    this.restante = this.presupuesto;
    this.actualizarColor();
  }

  // Agregar un gasto
  agregarGasto(gasto: number): void {
    if (gasto > this.restante) {
      this.error = true;
      return;
    }
    this.error = false;
    this.restante -= gasto;
    this.gastos.push(gasto); // agregar el gasto al array
    this.gasto = gasto; // mantener el valor para el mensaje de éxito
    this.actualizarColor();
  }
}