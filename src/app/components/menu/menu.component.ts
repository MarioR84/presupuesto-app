import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  salir(): void {
    this.authService.logout().catch(() => {
      // Si falla logout, igual cerramos sesion
    });
    this.router.navigate(['/despedida']);
  }
}