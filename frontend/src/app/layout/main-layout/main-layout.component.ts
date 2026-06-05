import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-800">
      <!-- Sidebar Dinámico -->
      <aside 
        class="bg-slate-900 shadow-xl flex flex-col transition-all duration-300 z-20 text-slate-300"
        [class.w-64]="!isCollapsed" 
        [class.w-20]="isCollapsed">
        
        <!-- LOGO AREA -->
        <div class="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div class="flex items-center gap-3 overflow-hidden" *ngIf="!isCollapsed">
            <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-inner">
              <span class="text-white font-black text-xl">P</span>
            </div>
            <span class="font-black text-xl tracking-tight text-white">PAOLONI</span>
          </div>
          <div class="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold mx-auto" *ngIf="isCollapsed">M</div>
          
          <button type="button" (click)="$event.preventDefault(); toggleSidebar()"  class="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800 absolute right-[-12px] bg-slate-900 border border-slate-700 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    [attr.d]="isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'" />
            </svg>
          </button>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 overflow-y-auto py-6 space-y-2 px-2">
          <ng-container *ngFor="let link of menuLinks">
            <!-- Renderizado Condicional por Rol -->
            <a *ngIf="hasAccess(link.roles)" 
               [routerLink]="link.path"
               routerLinkActive="bg-indigo-600/10 border-indigo-500 text-indigo-400"
               class="flex items-center px-3 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-lg border-l-4 border-transparent group">
              <span class="mr-3" [innerHTML]="link.icon"></span>
              <span class="whitespace-nowrap overflow-hidden transition-opacity duration-300 font-medium" 
                    [class.opacity-0]="isCollapsed"
                    [class.w-0]="isCollapsed">
                {{ link.label }}
              </span>
            </a>
          </ng-container>
        </nav>

        <!-- Footer / Usuario -->
        <div class="p-4 border-t border-slate-800 text-sm bg-slate-900">
           <div class="flex items-center space-x-3 overflow-hidden whitespace-nowrap">
             <div class="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
               {{ (authService.currentUser()?.role || 'U').charAt(0) }}
             </div>
             <div *ngIf="!isCollapsed">
               <p class="font-semibold text-white leading-tight">{{ authService.currentUser()?.role || 'Invitado' }}</p>
               <button type="button" (click)="$event.preventDefault(); cerrarSesion()"  class="text-slate-400 hover:text-indigo-400 text-xs mt-1 transition-colors flex items-center">
                 <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                 Cerrar Sesión
               </button>
             </div>
           </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Topbar -->
        <header class="h-16 bg-white shadow-sm flex items-center px-8 z-10 justify-between">
          <h1 class="text-xl font-bold text-slate-700">Panel Operativo</h1>
          <div class="flex items-center space-x-4">
             <!-- Campana de notificaciones (ejemplo) -->
             <button class="text-slate-400 hover:text-indigo-500 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
             </button>
          </div>
        </header>
        
        <!-- Área de las Vistas (Router Outlet) -->
        <div class="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-full">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MainLayoutComponent {
  router = inject(Router);
  
  constructor(public authService: AuthService) {}
  
  isCollapsed = false;

  // Arquitectura de 5 Apps Independientes (Nuevas Rutas)
  menuLinks = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      roles: ['Admin'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>'
    },
    { 
      path: '/viajes', 
      label: 'Viajes (Logística)', 
      roles: ['Admin', 'Logistica', 'Chofer'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>'
    },
    { 
      path: '/elaboracion', 
      label: 'Elaboración', 
      roles: ['Admin', 'Molinero'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>'
    },
    { 
      path: '/higiene', 
      label: 'Higiene (PCC)', 
      roles: ['Admin', 'Inspector_Calidad', 'Logistica'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    { 
      path: '/recorrida', 
      label: 'Recorrida Diaria', 
      roles: ['Admin', 'Inspector_Calidad'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>'
    },
    { 
      path: '/nc', 
      label: 'No Conformidades', 
      roles: ['Admin', 'Inspector_Calidad', 'Mantenimiento', 'Logistica', 'Molinero', 'No_Conformidades'],
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
    }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasAccess(roles: string[]): boolean {
    return roles.some(r => this.authService.hasRole(r));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
