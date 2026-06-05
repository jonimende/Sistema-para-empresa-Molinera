import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div class="w-full md:max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100 flex flex-col">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-indigo-600/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Acceso Corporativo</h2>
          <p class="text-slate-500 font-medium text-sm md:text-base mt-2">ERP Molino Paoloni - Producción</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col space-y-6 w-full">
          <div class="w-full">
            <label class="block text-sm md:text-base font-bold text-slate-700 mb-2">Correo Electrónico</label>
            <input type="email" formControlName="email" placeholder="usuario@paoloni.com" 
                   class="w-full px-4 py-3 min-h-[44px] md:min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium text-base">
          </div>

          <div class="w-full">
            <label class="block text-sm md:text-base font-bold text-slate-700 mb-2">Contraseña de Acceso</label>
            <input type="password" formControlName="password" placeholder="••••••••"
                   class="w-full px-4 py-3 min-h-[44px] md:min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium text-base">
          </div>

          <div *ngIf="errorMessage" class="p-4 bg-red-50 text-red-700 text-sm md:text-base font-bold rounded-xl border border-red-100 flex items-center">
             <svg class="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
             <span>{{ errorMessage }}</span>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
                  class="w-full min-h-[48px] md:min-h-[52px] py-3.5 bg-indigo-600 text-white font-black text-base md:text-lg rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center">
            <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Comprobando...' : 'Ingresar al Sistema' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Implementación estricta de Media Queries para Mobile First */
    @media (max-width: 768px) {
      :host {
        display: block;
        width: 100%;
      }
      .min-h-screen {
        align-items: flex-start !important;
        padding-top: 10vh !important;
      }
      input {
        width: 100% !important;
        font-size: 16px !important; /* Previene el zoom en iOS */
      }
      button {
        width: 100% !important;
        padding-top: 14px !important;
        padding-bottom: 14px !important;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // AuthService
  private authService = inject(AuthService); 

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.http.post(`${environment.apiUrl}/auth/login`, this.loginForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          
          this.authService.setSession(res.token, res.user);
          this.isLoading = false;
          
          const rol = this.authService.getRolActual();
          switch(rol) {
            case 'Camionero':
            case 'Chofer':
            case 'Logistica':
              this.router.navigate(['/viajes']);
              break;
            case 'Inspector_Calidad':
            case 'Higiene':
              this.router.navigate(['/higiene']);
              break;
            case 'No_Conformidades':
              this.router.navigate(['/nc']);
              break;
            case 'Molinero':
              this.router.navigate(['/elaboracion']);
              break;
            case 'Admin':
              this.router.navigate(['/']); 
              break;
            default:
              this.router.navigate(['/']); 
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Credenciales inválidas o acceso denegado por el servidor.';
        }
      });
    }
  }
}
