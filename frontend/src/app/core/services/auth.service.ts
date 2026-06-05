import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  email?: string;
  username?: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  // Utilizamos Signals para que la interfaz reaccione inmediatamente a los cambios de estado (login/logout)
  public currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem('user_role', user.role);
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('user_role');
    this.currentUser.set(null);
  }

  getRolActual(): string {
    return localStorage.getItem('user_role') || '';
  }

  tieneRol(rolesPermitidos: string[]): boolean {
    const miRol = this.getRolActual();
    return miRol === 'Admin' || rolesPermitidos.includes(miRol);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin'; // Admin tiene todos los roles implícitos
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (user?.role === 'Admin') return true;
    return user?.permissions.includes(permission) || false;
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
