import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [RouterModule, MenuComponent],
  templateUrl: './operaciones.component.html'
})
export class OperacionesComponent {}