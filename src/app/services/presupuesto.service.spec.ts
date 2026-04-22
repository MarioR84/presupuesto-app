import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  presupuestos: any[] = [];

  agregarPresupuesto(presupuesto: any) {
    this.presupuestos.push(presupuesto);
  }

  obtenerPresupuestos() {
    return this.presupuestos;
  }

}