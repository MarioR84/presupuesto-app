import { Injectable } from '@angular/core';
import { firebaseConfig, firebaseEnabled } from '../firebase.config';

/** Estructura de usuario para almacenamiento local */
interface Usuario {
  email: string;
  password: string;
}

/**
 * Servicio de autenticación.
 * Soporta Firebase (si está habilitado) y fallback a localStorage.
 * Carga Firebase bajo demanda para optimizar el bundle.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'usuariosApp';
  private readonly SESSION_KEY = 'sesionActiva';
  private auth: any = null;
  private firebaseAuthApi: any = null;
  private firebaseReadyPromise: Promise<boolean> | null = null;

  constructor() {
    this.firebaseReadyPromise = this.initFirebaseAuth();
  }

  /** Carga Firebase dinámicamente solo si está habilitado */
  private async initFirebaseAuth(): Promise<boolean> {
    if (!this.isBrowser() || !firebaseEnabled || !this.firebaseConfigValida()) {
      return false;
    }

    try {
      const firebaseApp = await import('firebase/app');
      const firebaseAuth = await import('firebase/auth');

      const app = firebaseApp.getApps().length > 0
        ? firebaseApp.getApp()
        : firebaseApp.initializeApp(firebaseConfig);
      this.auth = firebaseAuth.getAuth(app);
      this.firebaseAuthApi = firebaseAuth;

      firebaseAuth.onAuthStateChanged(this.auth, (user: any) => {
        if (!this.isBrowser()) {
          return;
        }

        if (user?.email) {
          localStorage.setItem(this.SESSION_KEY, user.email);
        } else {
          localStorage.removeItem(this.SESSION_KEY);
        }
      });

      return true;
    } catch {
      this.auth = null;
      this.firebaseAuthApi = null;
      return false;
    }
  }

  /** Valida que la configuración de Firebase sea completa */
  private firebaseConfigValida(): boolean {
    return !!(
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
    );
  }

  /** Verifica si Firebase está activo */
  private usandoFirebase(): boolean {
    return !!this.auth;
  }

  /** Verifica si estamos en navegador (no SSR) */
  private isBrowser(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /** Recupera lista de usuarios del localStorage */
  private getUsuarios(): Usuario[] {
    if (!this.isBrowser()) {
      return [];
    }

    const data = localStorage.getItem(this.USERS_KEY);
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as Usuario[];
    } catch {
      return [];
    }
  }

  /** Persiste usuarios en localStorage */
  private saveUsuarios(usuarios: Usuario[]): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
  }

  /** Normaliza email para búsqueda case-insensitive */
  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Registra un nuevo usuario.
   * Intenta con Firebase primero si está disponible, luego fallback a localStorage.
   */
  async registrar(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const emailNormalizado = this.normalizarEmail(email);
    const passwordNormalizado = password.trim();

    if (!emailNormalizado || !passwordNormalizado) {
      return { ok: false, error: 'Completa correo y contrasena.' };
    }

    if (passwordNormalizado.length < 6) {
      return { ok: false, error: 'La contrasena debe tener al menos 6 caracteres.' };
    }

    if (this.firebaseReadyPromise) {
      await this.firebaseReadyPromise;
    }

    if (this.usandoFirebase() && this.auth) {
      try {
        await this.firebaseAuthApi.createUserWithEmailAndPassword(
          this.auth,
          emailNormalizado,
          passwordNormalizado
        );
        localStorage.setItem(this.SESSION_KEY, emailNormalizado);
        return { ok: true };
      } catch (error: any) {
        const code = error?.code ?? '';
        if (code === 'auth/email-already-in-use') {
          return { ok: false, error: 'Ese correo ya esta registrado.' };
        }
        if (code === 'auth/invalid-email') {
          return { ok: false, error: 'Correo invalido.' };
        }
        return { ok: false, error: 'No se pudo registrar con Firebase.' };
      }
    }

    const usuarios = this.getUsuarios();
    const existe = usuarios.some((u) => this.normalizarEmail(u.email) === emailNormalizado);

    if (existe) {
      return { ok: false, error: 'Ese correo ya esta registrado.' };
    }

    usuarios.push({ email: emailNormalizado, password: passwordNormalizado });
    this.saveUsuarios(usuarios);
    localStorage.setItem(this.SESSION_KEY, emailNormalizado);
    return { ok: true };
  }

  /**
   * Inicia sesión con email y contraseña.
   * Intenta con Firebase primero, luego fallback a localStorage.
   */
  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const emailNormalizado = this.normalizarEmail(email);
    const passwordNormalizado = password.trim();

    if (!emailNormalizado || !passwordNormalizado) {
      return { ok: false, error: 'Completa correo y contrasena.' };
    }

    if (this.firebaseReadyPromise) {
      await this.firebaseReadyPromise;
    }

    if (this.usandoFirebase() && this.auth) {
      try {
        await this.firebaseAuthApi.signInWithEmailAndPassword(
          this.auth,
          emailNormalizado,
          passwordNormalizado
        );
        localStorage.setItem(this.SESSION_KEY, emailNormalizado);
        return { ok: true };
      } catch {
        return { ok: false, error: 'Correo o contrasena incorrectos.' };
      }
    }

    const usuarios = this.getUsuarios();
    const usuario = usuarios.find((u) => this.normalizarEmail(u.email) === emailNormalizado);

    if (!usuario || usuario.password !== passwordNormalizado) {
      return { ok: false, error: 'Correo o contrasena incorrectos.' };
    }

    localStorage.setItem(this.SESSION_KEY, emailNormalizado);
    return { ok: true };
  }

  /** Cierra sesión del usuario actual */
  async logout(): Promise<void> {
    if (!this.isBrowser()) {
      return;
    }

    if (this.firebaseReadyPromise) {
      await this.firebaseReadyPromise;
    }

    if (this.usandoFirebase() && this.auth) {
      try {
        await this.firebaseAuthApi.signOut(this.auth);
      } catch {
        // Si falla Firebase, igual cerramos sesion local.
      }
    }

    localStorage.removeItem(this.SESSION_KEY);
  }

  /** Verifica si hay usuario autenticado en sesión actual */
  estaAutenticado(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    return !!localStorage.getItem(this.SESSION_KEY);
  }
}