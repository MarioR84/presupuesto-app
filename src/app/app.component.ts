import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly VERSION_STORAGE_KEY = 'appVersion';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.verificarVersion();
  }

  private async verificarVersion(): Promise<void> {
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { version?: string };
      const versionActual = data.version?.trim();
      if (!versionActual) {
        return;
      }

      const versionGuardada = localStorage.getItem(this.VERSION_STORAGE_KEY);

      if (!versionGuardada) {
        localStorage.setItem(this.VERSION_STORAGE_KEY, versionActual);
        return;
      }

      if (versionGuardada !== versionActual) {
        localStorage.setItem(this.VERSION_STORAGE_KEY, versionActual);
        alert('Hay una nueva version de la app. Se recargara para aplicar cambios.');
        window.location.reload();
      }
    } catch {
      // Si falla la verificacion, la app sigue funcionando normalmente.
    }
  }
}