import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  modo: 'login' | 'registro' = 'login';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/']);
    }
  }

  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.error = '';
  }

  async continuar(): Promise<void> {
    this.error = '';

    const resultado = this.modo === 'login'
      ? await this.authService.login(this.email, this.password)
      : await this.authService.registrar(this.email, this.password);

    if (!resultado.ok) {
      this.error = resultado.error ?? 'No se pudo continuar.';
      return;
    }

    this.router.navigate(['/']);
  }
}