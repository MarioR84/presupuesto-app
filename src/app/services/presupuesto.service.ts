import { Injectable } from '@angular/core';

/** Estructura de un gasto individual con monto y justificación */
export interface GastoRegistrado {
  monto: number;
  justificacion: string;
}

/** Estructura principal de un presupuesto con historial de gastos */
export interface Presupuesto {
  nombre: string;
  meses: string[];
  monto: number;
  restante: number;
  gastos: GastoRegistrado[];
}

/**
 * Servicio central para gestionar presupuestos y gastos.
 * Maneja persistencia en localStorage y operaciones CRUD.
 */
@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private readonly PRESUPUESTO_INICIAL_KEY = 'presupuestoInicial';
  private readonly PRESUPUESTOS_KEY = 'presupuestos';
  private readonly MESES_VALIDOS = [
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

  presupuestoInicial: number = 0;
  presupuestos: Presupuesto[] = [];

  constructor() {
    this.cargarDesdeStorage();
  }

  /** Verifica si estamos en navegador (no SSR) */
  private isBrowser(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /** Normaliza nombres para comparación case-insensitive */
  private normalizarNombre(nombre: string): string {
    return this.normalizarTexto(nombre);
  }

  /** Normaliza texto removiendo acentos y unificando formato */
  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  /** Normaliza meses y valida que correspondan a un mes real */
  private normalizarMes(mes: string): string | null {
    const entrada = this.normalizarTexto(mes);
    if (!entrada) {
      return null;
    }

    const exacto = this.MESES_VALIDOS.find(
      (m) => this.normalizarTexto(m) === entrada
    );
    if (exacto) {
      return exacto;
    }

    const porPrefijo = this.MESES_VALIDOS.find((m) =>
      entrada.startsWith(this.normalizarTexto(m))
    );
    return porPrefijo ?? null;
  }

  private obtenerMesesValidosUnicos(meses: string[]): string[] {
    const unicos: string[] = [];
    for (const mes of meses) {
      const normalizado = this.normalizarMes(mes);
      if (!normalizado) {
        continue;
      }

      if (!unicos.includes(normalizado)) {
        unicos.push(normalizado);
      }
    }

    return unicos;
  }

  getMesesDisplay(presupuesto: { meses?: string[]; mes?: string } | null | undefined): string {
    const meses = this.obtenerMesesValidosUnicos(
      Array.isArray(presupuesto?.meses)
        ? presupuesto.meses
        : presupuesto?.mes
          ? [presupuesto.mes]
          : []
    );

    return meses.length > 0 ? meses.join(', ') : 'Sin meses registrados';
  }

  /** Carga datos iniciales desde localStorage */
  private cargarDesdeStorage(): void {
    if (!this.isBrowser()) {
      return;
    }

    const inicialGuardado = localStorage.getItem(this.PRESUPUESTO_INICIAL_KEY);
    this.presupuestoInicial = inicialGuardado ? Number(inicialGuardado) : 0;

    const presupuestosGuardados = localStorage.getItem(this.PRESUPUESTOS_KEY);
    if (!presupuestosGuardados) {
      return;
    }

    try {
      const parsed = JSON.parse(presupuestosGuardados) as Array<
        Presupuesto & { mes?: string }
      >;
      this.presupuestos = parsed.map((p) => ({
        nombre: p.nombre,
        meses: this.obtenerMesesValidosUnicos(
          Array.isArray(p.meses)
            ? p.meses
            : p.mes
              ? [p.mes]
              : []
        ),
        monto: Number(p.monto),
        restante: Number(p.restante),
        gastos: Array.isArray((p as any).gastos) ? (p as any).gastos : []
      }));
      this.guardarEnStorage();
    } catch {
      this.presupuestos = [];
    }
  }

  /** Persiste cambios en localStorage */
  private guardarEnStorage(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.PRESUPUESTO_INICIAL_KEY, this.presupuestoInicial.toString());
    localStorage.setItem(this.PRESUPUESTOS_KEY, JSON.stringify(this.presupuestos));
  }

  // ========================
  // PRESUPUESTO INICIAL
  // ========================
  setPresupuestoInicial(monto: number) {
    this.presupuestoInicial = monto;
    this.guardarEnStorage();
  }

  getPresupuestoInicial() {
    return this.presupuestoInicial;
  }

  // ========================
  // GESTIÓN DE PRESUPUESTOS
  // ========================
  /**
   * Crea o acumula presupuesto.
   * Si ya existe con ese nombre, suma meses y montos.
   */
  setPresupuesto(
    presupuesto: { nombre: string; mes: string; monto: number; restante: number }
  ): { ok: boolean; error?: string; accion?: 'creado' | 'acumulado' } {
    const nombreNormalizado = this.normalizarNombre(presupuesto.nombre);
    const mesNuevo = this.normalizarMes(presupuesto.mes);

    if (!mesNuevo) {
      return {
        ok: false,
        error: 'Mes no valido. Selecciona un mes del listado.'
      };
    }

    const indexExistente = this.presupuestos.findIndex(
      (p) => this.normalizarNombre(p.nombre) === nombreNormalizado
    );

    if (indexExistente >= 0) {
      const actual = this.presupuestos[indexExistente];
      const yaTieneMes = actual.meses.includes(mesNuevo);

      if (!yaTieneMes) {
        actual.meses.push(mesNuevo);
      }

      actual.monto += Number(presupuesto.monto);
      actual.restante += Number(presupuesto.restante);
      this.guardarEnStorage();
      return { ok: true, accion: 'acumulado' };
    }

    this.presupuestos.push({
      nombre: presupuesto.nombre.trim(),
      meses: [mesNuevo],
      monto: Number(presupuesto.monto),
      restante: Number(presupuesto.restante),
      gastos: []
    });
    this.guardarEnStorage();
    return { ok: true, accion: 'creado' };
  }

  getPresupuesto() {
    return this.presupuestos;
  }

  /** Suma dinero al monto y restante de un presupuesto */
  agregarMonto(index: number, montoExtra: number): boolean {
    if (index < 0 || index >= this.presupuestos.length || montoExtra <= 0) {
      return false;
    }

    this.presupuestos[index].monto += montoExtra;
    this.presupuestos[index].restante += montoExtra;
    this.guardarEnStorage();
    return true;
  }

  /** Elimina un presupuesto y todos sus gastos */
  eliminarPresupuesto(index: number): boolean {
    if (index < 0 || index >= this.presupuestos.length) {
      return false;
    }

    this.presupuestos.splice(index, 1);
    this.guardarEnStorage();
    return true;
  }

  // ========================
  // GESTIÓN DE GASTOS
  // ========================
  /**
   * Registra un gasto en un presupuesto si hay fondos.
   * Valida que no supere el monto restante.
   */
  registrarGasto(index: number, gasto: number, justificacion: string = ''): boolean {
    if (index < 0 || index >= this.presupuestos.length || gasto <= 0) {
      return false;
    }

    const presupuesto = this.presupuestos[index];
    if (gasto > presupuesto.restante) {
      return false;
    }

    presupuesto.restante -= gasto;
    presupuesto.gastos.push({ monto: gasto, justificacion });
    this.guardarEnStorage();
    return true;
  }

  // ========================
  // UTILIDADES
  // ========================
  /** Limpia todos los presupuestos */
  limpiarPresupuestos() {
    this.presupuestos = [];
    this.guardarEnStorage();
  }

  /** Limpia sesión local (logout) */
  cerrarSesionLocal() {
    this.presupuestoInicial = 0;
    this.presupuestos = [];

    if (this.isBrowser()) {
      localStorage.removeItem(this.PRESUPUESTO_INICIAL_KEY);
      localStorage.removeItem(this.PRESUPUESTOS_KEY);
    }
  }
}