import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-despedida',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './despedida.component.html',
  styleUrls: ['./despedida.component.scss']
})
export class DespedidaComponent {}
