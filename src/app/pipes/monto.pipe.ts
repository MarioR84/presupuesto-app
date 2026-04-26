import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear montos en colones costarricenses.
 * Usa Intl.NumberFormat para garantizar compatibilidad en todos los navegadores
 * incluyendo Safari/iPhone sin depender del sistema de locale de Angular.
 * Ejemplo: 132400 → 132.400,00
 */
@Pipe({ name: 'monto', standalone: true })
export class MontoPipe implements PipeTransform {
  private fmt = new Intl.NumberFormat('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  transform(value: number | null | undefined): string {
    if (value == null || isNaN(Number(value))) {
      return '0,00';
    }
    return this.fmt.format(Number(value));
  }
}
