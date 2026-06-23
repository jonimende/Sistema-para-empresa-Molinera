import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="h-full flex items-center justify-center flex-col fade-in">
      <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <svg class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      </div>
      <h2 class="text-3xl font-black text-slate-800 tracking-tight">Hub de Aplicaciones</h2>
      <p class="text-slate-500 font-medium mt-3 text-lg">Selecciona un módulo aislado en el panel lateral para iniciar tu sesión operativa.</p>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LauncherHomeComponent {}

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'recorrida', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadComponent: () => import('./features/dashboard-principal/dashboard-principal.component').then(m => m.DashboardPrincipalComponent),
      },
      {
        path: 'viajes',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Logistica', 'Camionero'] },
        loadComponent: () => import('./features/viajes/viajes.component').then(m => m.ViajesComponent),
      },
      {
        path: 'elaboracion',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Elaboracion'] },
        loadComponent: () => import('./features/elaboracion/elaboracion.component').then(m => m.ElaboracionComponent),
      },
      {
        path: 'higiene',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Higiene'] },
        loadComponent: () => import('./features/higiene/higiene.component').then(m => m.HigieneComponent),
      },
      {
        path: 'recorrida',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Auditoria'] },
        loadComponent: () => import('./features/recorrida/recorrida.component').then(m => m.RecorridaComponent),
      },
      {
        path: 'nc',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Calidad'] },
        loadComponent: () => import('./features/nc/nc.component').then(m => m.NcComponent),
      },
      {
        path: 'acoplados',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Logistica'] },
        loadComponent: () => import('./features/acoplados/acoplados.component').then(m => m.AcopladosComponent),
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: 'recorrida' }
];
