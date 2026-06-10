import { Component, inject, OnInit , NgZone} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 h-[calc(100vh-6rem)] flex flex-col pb-6">
      <header class="mb-2 flex justify-between items-end border-b pb-4 border-slate-200">
        <div>
          <h2 class="text-2xl font-black text-slate-800">Módulo Logístico Integrado</h2>
          <p class="text-slate-500 font-medium">Panel Maestro de Viajes y Flota.</p>
        </div>
        <div class="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 flex items-center">
          <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="text-indigo-900 font-bold text-sm">{{ userEmail }} <span class="text-indigo-400 font-normal">({{ userRole }})</span></span>
        </div>
      </header>

      <!-- TABS de Navegación con RBAC -->
      <div class="flex overflow-x-auto hide-scrollbar space-x-1 bg-slate-200/50 p-1 rounded-xl shadow-inner mb-4">
        <button type="button" (click)="$event.preventDefault(); activeTab = 'mis_viajes'" 
          [class]="activeTab === 'mis_viajes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'"
          class="flex-1 py-2.5 px-4 whitespace-nowrap rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Mis Viajes
        </button>
        <button type="button" (click)="$event.preventDefault(); activeTab = 'combustible'" 
          [class]="activeTab === 'combustible' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'"
          class="flex-1 py-2.5 px-4 whitespace-nowrap rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Combustible
        </button>
        <button type="button" (click)="$event.preventDefault(); activeTab = 'service'" 
          [class]="activeTab === 'service' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'"
          class="flex-1 py-2.5 px-4 whitespace-nowrap rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Service
        </button>
        
        <!-- Pestañas Protegidas por Rol -->
        <ng-container *ngIf="authService.tieneRol(['Admin', 'Logistica'])">
          <button type="button" (click)="$event.preventDefault(); activeTab = 'camiones'" 
            [class]="activeTab === 'camiones' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'"
            class="flex-1 py-2.5 px-4 whitespace-nowrap rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            Camiones
          </button>
          
          <button type="button" (click)="$event.preventDefault(); activeTab = 'panel_admin'" 
            [class]="activeTab === 'panel_admin' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'"
            class="flex-1 py-2.5 px-4 whitespace-nowrap rounded-lg font-black text-sm transition-all duration-200 border border-indigo-200 ml-2 flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Panel de Admin
          </button>
        </ng-container>
      </div>

      <!-- Contenedor de Vistas -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden relative">
        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- VISTA: MIS VIAJES (Despacho Principal) -->
          <div *ngIf="activeTab === 'mis_viajes'" class="fade-in">
            <div class="flex justify-between items-center border-b pb-2 mb-6">
              <h3 class="text-xl font-bold text-slate-700">Historial de Viajes</h3>
              <button type="button" (click)="$event.preventDefault(); isCreatingViaje = !isCreatingViaje; isViewingViaje = false; selectedViajeId = null; viajeForm.reset({ comprobante_relacionado: 'REMITO', chofer_email: userEmail })"  class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                {{ isCreatingViaje ? 'Cancelar' : 'Nuevo Despacho' }}
              </button>
            </div>

            <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-12rem)] min-h-[60vh]">
              <!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let v of viajes" (click)="verDetalleViaje(v)" class="p-4 border-b border-slate-200 hover:bg-white cursor-pointer transition flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 w-full relative" [class.bg-indigo-50]="selectedViaje?.id === v.id">
                  <div>
                    <p class="font-bold text-slate-800">{{ v.Destino?.nombre_lugar || v.lugar_llegada }}</p>
                    <p class="text-xs text-slate-500 font-medium">{{ v.fecha_salida | date:'shortDate' }} | <span class="text-indigo-600 font-bold">{{ v.kg_carga }} kg</span></p>
                  </div>
                  <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                    <button type="button" (click)="$event.stopPropagation(); editarViaje(v)" class="text-blue-600 hover:text-blue-800 font-medium" title="Editar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button type="button" (click)="$event.stopPropagation(); deleteViaje(v.id)" class="text-red-600 hover:text-red-800 font-medium" title="Borrar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                <div *ngIf="viajes.length === 0" class="p-6 text-center text-slate-400">
                  No hay despachos registrados
                </div>
              </div>

              <!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!isViewingViaje && !isCreatingViaje && !selectedViajeId" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p class="font-medium text-lg">Selecciona un viaje de la lista</p>
                  <p class="text-sm">o crea un nuevo despacho</p>
                </div>

                <!-- Modo Lectura -->
                <div *ngIf="isViewingViaje && selectedViaje" class="p-4 md:p-8">
                  <button (click)="isViewingViaje=false; selectedViaje=null" class="md:hidden mb-4 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h4 class="text-2xl font-black text-slate-800">Detalle del Despacho</h4>
                      <p class="text-indigo-600 font-bold mt-1">#{{ selectedViaje.id }} | {{ selectedViaje.comprobante_relacionado }}: {{ selectedViaje.numero_comprobante }}</p>
                    </div>
                    <button type="button" (click)="$event.preventDefault(); editarViaje(selectedViaje)" class="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition flex items-center shadow-sm">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Editar Despacho
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                      <div class="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Chofer</p>
                        <p class="text-slate-800 font-bold text-lg">{{ selectedViaje.chofer_email || selectedViaje.chofer || 'Sin Asignar' }}</p>
                      </div>
                      
                      <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Ruta y Tiempos</p>
                        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
                          <div class="w-5/12">
                            <p class="text-xs text-slate-500 font-bold mb-1">ORIGEN</p>
                            <p class="font-bold text-slate-800">{{ selectedViaje.Origen?.nombre_lugar || selectedViaje.lugar_salida }}</p>
                            <p class="text-sm text-slate-500">{{ selectedViaje.fecha_salida | date:'mediumDate' }} </p>
                          </div>
                          <div class="w-2/12 flex justify-center text-indigo-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                          </div>
                          <div class="w-5/12 text-right">
                            <p class="text-xs text-slate-500 font-bold mb-1">DESTINO</p>
                            <p class="font-bold text-slate-800">{{ selectedViaje.Destino?.nombre_lugar || selectedViaje.lugar_llegada }}</p>
                            <p class="text-sm text-slate-500">{{ selectedViaje.fecha_llegada | date:'mediumDate' }} </p>
                          </div>
                        </div>
                      </div>
  
                      <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Manifiesto de Carga</p>
                        <div class="grid grid-cols-3 gap-4">
                          <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Carga</p>
                            <p class="font-bold text-indigo-900">{{ selectedViaje.Carga?.nombre_carga || selectedViaje.carga_transportada }}</p>
                          </div>
                          <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Peso</p>
                            <p class="font-bold text-indigo-900">{{ selectedViaje.kg_carga }} kg</p>
                          </div>
                          <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Distancia</p>
                            <p class="font-bold text-indigo-900">{{ selectedViaje.km_recorridos }} km</p>
                          </div>
                        </div>
                      </div>
  
                      <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Comprobante Respaldatorio</p>
                        <div class="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div>
                            <p class="font-bold text-slate-800">{{ selectedViaje.comprobante_relacionado }}</p>
                            <p class="text-slate-500 font-mono mt-1 text-sm">{{ selectedViaje.numero_comprobante }}</p>
                          </div>
                          <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                <!-- Modo Formulario -->
                <form *ngIf="isCreatingViaje || selectedViajeId" [formGroup]="viajeForm" class="p-4 md:p-6 space-y-6">
                  <button (click)="isCreatingViaje=false; selectedViajeId=null" class="md:hidden mb-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h4 class="font-black text-xl text-slate-800">{{ selectedViajeId ? 'Editar Despacho' : 'Nuevo Despacho' }}</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Chofer Asignado</label>
                      <select formControlName="chofer_email" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 font-bold text-indigo-700">
                        <option value="" disabled selected>Seleccione Chofer...</option>
                        <option *ngFor="let ch of listadoChoferes" [value]="ch.nombre">{{ ch.nombre }}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Lugar de Salida</label>
                      <input type="text" formControlName="lugar_salida" list="ubicacionesList" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5 px-3 bg-white">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Fecha Salida</label>
                      <input type="date" formControlName="fecha_salida" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-white">
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Lugar de Llegada</label>
                      <input type="text" formControlName="lugar_llegada" list="ubicacionesList" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5 px-3 bg-white">
                    </div>
                    <datalist id="ubicacionesList">
                      <option *ngFor="let u of ubicaciones" [value]="u.nombre_lugar"></option>
                    </datalist>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Fecha Llegada</label>
                      <input type="date" formControlName="fecha_llegada" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-white">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Carga</label>
                      <select formControlName="carga_transportada" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50">
                        <option value="" disabled selected>Producto...</option>
                        <option value="Arroz Blanco">Arroz Blanco</option>
                        <option value="Medio Grano">Medio Grano</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">KG Transportados</label>
                      <input type="number" formControlName="kg_carga" placeholder="Ej: 30000" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 font-bold text-indigo-700">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">KM Recorridos</label>
                      <input type="number" formControlName="km_recorridos" placeholder="Ej: 450" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 font-mono text-slate-600">
                    </div>
                  </div>

                  <div class="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-2">Comprobante Relacionado</label>
                      <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button type="button" (click)="$event.preventDefault(); viajeForm.get('comprobante_relacionado')?.setValue('REMITO')" 
                          [class]="viajeForm.get('comprobante_relacionado')?.value === 'REMITO' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'"
                          class="flex-1 py-2 rounded-md font-bold text-sm transition-all duration-200">
                          REMITO
                        </button>
                        <button type="button" (click)="$event.preventDefault(); viajeForm.get('comprobante_relacionado')?.setValue('CARTA DE PORTE')" 
                          [class]="viajeForm.get('comprobante_relacionado')?.value === 'CARTA DE PORTE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'"
                          class="flex-1 py-2 rounded-md font-bold text-sm transition-all duration-200 ml-1">
                          CARTA DE PORTE
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-2">Número de Comprobante</label>
                      <input type="text" formControlName="numero_comprobante" placeholder="0001-00001234" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-white font-mono font-bold text-lg">
                    </div>
                  </div>

                  <div class="flex justify-end pt-4">
                    <button type="button" (click)="$event.preventDefault(); submitViaje()"  [disabled]="isLoading || viajeForm.invalid" class="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50">
                      {{ isLoading ? 'Guardando...' : (selectedViajeId ? 'Guardar Cambios' : 'Sellar y Registrar Viaje') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
<!-- VISTAS COMUNES (Data Tables) -->
          <div *ngIf="activeTab === 'combustible'" class="fade-in">
            <div class="flex justify-between items-center border-b pb-2 mb-6">
              <h3 class="text-xl font-bold text-slate-700">Registro de Combustible</h3>
              <button type="button" (click)="$event.preventDefault(); resetCombustibleForm()"  class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                {{ isCreatingCombustible ? 'Cancelar' : 'Nueva Carga' }}
              </button>
            </div>

            <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-12rem)] min-h-[60vh]">
              <!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId, 'flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId)}">
                
                  <!-- Contenedor Tarjetas Móvil -->
                  <div class="grid grid-cols-1 gap-4 md:hidden p-4">
                    <div *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative" [class.border-indigo-400]="selectedCombustible?.id === c.id">
                      <div class="flex justify-between items-start mb-2">
                        <p class="font-black text-slate-800 text-lg">{{ c.CamionRel?.patente_chasis || c.patente_chasis }}</p>
                        <span class="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{{ c.litros_gasoil }} L</span>
                      </div>
                      <p class="text-sm text-slate-500 font-medium mb-3">{{ c.fecha | date:'mediumDate' }}</p>
                      <div class="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                        <button type="button" (click)="$event.stopPropagation(); editarCombustible(c)" class="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg font-bold text-sm">Editar</button>
                        <button type="button" (click)="$event.stopPropagation(); deleteCombustible(c.id)" class="flex-1 bg-red-50 text-red-700 py-2 rounded-lg font-bold text-sm">Borrar</button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tabla Escritorio -->
                  <div class="hidden md:block">
                    <table class="w-full text-left">
                      <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Patente</th>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Litros</th>
                          <th class="px-4 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" class="hover:bg-slate-50 cursor-pointer transition-colors" [class.bg-indigo-50]="selectedCombustible?.id === c.id">
                          <td class="px-4 py-3 font-bold text-slate-800">{{ c.CamionRel?.patente_chasis || c.patente_chasis }}</td>
                          <td class="px-4 py-3 text-sm text-slate-500">{{ c.fecha | date:'shortDate' }}</td>
                          <td class="px-4 py-3 text-sm font-bold text-indigo-600">{{ c.litros_gasoil }} L</td>
                          <td class="px-4 py-3 text-right space-x-2">
                            <button type="button" (click)="$event.stopPropagation(); editarCombustible(c)" class="text-blue-600 hover:text-blue-800 font-medium" title="Editar"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                            <button type="button" (click)="$event.stopPropagation(); deleteCombustible(c.id)" class="text-red-600 hover:text-red-800 font-medium" title="Borrar"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                <div *ngIf="cargas.length === 0" class="p-6 text-center text-slate-400">
                  No hay cargas registradas
                </div>
              </div>

              <!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId), 'flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!isViewingCombustible && !isCreatingCombustible && !selectedCombustibleId" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <p class="font-medium text-lg">Selecciona una carga de la lista</p>
                  <p class="text-sm">o registra una nueva</p>
                </div>

                <!-- Modo Lectura -->
                <div *ngIf="isViewingCombustible && selectedCombustible" class="p-4 md:p-8">
                  <button (click)="isViewingCombustible=false; selectedCombustible=null" class="md:hidden mb-4 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h4 class="text-2xl font-black text-slate-800">Detalle de Carga</h4>
                      <p class="text-indigo-600 font-bold mt-1">Fecha: {{ selectedCombustible.fecha | date:'longDate' }}</p>
                    </div>
                    <button type="button" (click)="$event.preventDefault(); editarCombustible(selectedCombustible)" class="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition flex items-center shadow-sm">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Editar Carga
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Veh├¡culo (Patente)</p>
                      <p class="text-slate-800 font-mono font-bold text-lg bg-slate-100 px-3 py-1 rounded inline-block border border-slate-200">{{ selectedCombustible.CamionRel?.patente_chasis || selectedCombustible.patente_chasis }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Litros de Gasoil</p>
                      <p class="text-indigo-700 font-black text-2xl">{{ selectedCombustible.litros_gasoil }} L</p>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Kilometraje</p>
                      <p class="text-slate-800 font-bold text-lg">{{ selectedCombustible.kilometraje }} KM</p>
                    </div>

                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Consumo Promedio</p>
                      <p class="text-slate-800 font-bold text-lg">{{ selectedCombustible.consumo_l_100km > 0 ? (selectedCombustible.consumo_l_100km | number:'1.2-2') + ' L/100km' : 'Primera carga' }}</p>
                    </div>
                    
                    <div *ngIf="selectedCombustible.foto_tablero" class="col-span-2 mt-4">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Evidencia (Tablero)</p>
                      <img *ngIf="selectedCombustible.foto_url || selectedCombustible.foto_tablero" [src]="getImageUrl(selectedCombustible.foto_url || selectedCombustible.foto_tablero)" class="w-full max-h-64 object-contain bg-slate-100 rounded shadow-md border" alt="Evidencia">
                    </div>
                  </div>
                </div>

                <!-- Modo Formulario -->
                <form *ngIf="isCreatingCombustible || selectedCombustibleId" [formGroup]="combustibleForm" class="p-4 md:p-6 space-y-6 w-full max-w-lg mx-auto overflow-y-auto">
                  <button (click)="isCreatingCombustible=false; selectedCombustibleId=null" class="md:hidden mb-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h4 class="font-black text-xl text-slate-800">{{ selectedCombustibleId ? 'Editar Carga' : 'Nueva Carga' }}</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Camión</label>
                      <select formControlName="patente_chasis" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base font-bold text-indigo-700 font-mono shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                        <option value="" disabled selected>Seleccione Vehículo...</option>
                        <option *ngFor="let c of camiones" [value]="c.patente_chasis">{{ c.patente_chasis }}</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Fecha</label>
                      <input type="date" formControlName="fecha" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Litros de Gasoil</label>
                      <input type="number" step="0.1" formControlName="litros_gasoil" placeholder="Ej: 150.5" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors font-bold">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Kilometraje</label>
                      <input type="number" formControlName="kilometraje" placeholder="Ej: 125000" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Consumo L/100km</label>
                      <input type="number" formControlName="consumo" class="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 md:p-3 text-lg md:text-base text-indigo-700 shadow-sm font-bold" readonly>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Foto Tablero</label>
                      <input type="file" (change)="onFileSelected($event)" accept="image/*" class="w-full text-base text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200">
                    </div>
                  </div>
                  
                  <div class="pt-4 flex flex-col md:flex-row md:justify-end border-t border-slate-100">
                    <button type="button" (click)="$event.preventDefault(); submitCombustible()"  [disabled]="combustibleForm.invalid || isLoading" class="w-full md:w-auto px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md mt-4 md:mt-0 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
                      Guardar Carga
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div *ngIf="activeTab === 'service'" class="fade-in">
            <div class="flex justify-between items-center border-b pb-2 mb-6">
              <h3 class="text-xl font-bold text-slate-700">Mantenimiento de Flota</h3>
              <button type="button" (click)="$event.preventDefault(); resetServiceForm()" class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                {{ isCreatingService ? 'Cancelar' : 'Nuevo Service' }}
              </button>
            </div>

            <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-12rem)] min-h-[60vh]">
              <!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingService || selectedService || selectedServiceId, 'flex': !(isCreatingService || selectedService || selectedServiceId)}">
                
                  <!-- Contenedor Tarjetas Móvil -->
                  <div class="grid grid-cols-1 gap-4 md:hidden p-4">
                    <div *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative" [class.border-indigo-400]="selectedService?.id === s.id">
                      <div class="flex justify-between items-start mb-2">
                        <p class="font-black text-slate-800 text-lg">{{ s.CamionRel?.patente_chasis || s.patente_chasis }}</p>
                        <span class="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{{ s.km }} KM</span>
                      </div>
                      <p class="text-sm text-slate-500 font-medium mb-3">{{ s.fecha | date:'mediumDate' }}</p>
                      <div class="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                        <button type="button" (click)="$event.stopPropagation(); editarService(s)" class="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg font-bold text-sm">Editar</button>
                        <button type="button" (click)="$event.stopPropagation(); deleteService(s.id)" class="flex-1 bg-red-50 text-red-700 py-2 rounded-lg font-bold text-sm">Borrar</button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tabla Escritorio -->
                  <div class="hidden md:block">
                    <table class="w-full text-left">
                      <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Patente</th>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">KMs</th>
                          <th class="px-4 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" class="hover:bg-slate-50 cursor-pointer transition-colors" [class.bg-indigo-50]="selectedService?.id === s.id">
                          <td class="px-4 py-3 font-bold text-slate-800">{{ s.CamionRel?.patente_chasis || s.patente_chasis }}</td>
                          <td class="px-4 py-3 text-sm text-slate-500">{{ s.fecha | date:'shortDate' }}</td>
                          <td class="px-4 py-3 text-sm font-bold text-indigo-600">{{ s.km }}</td>
                          <td class="px-4 py-3 text-right space-x-2">
                            <button type="button" (click)="$event.stopPropagation(); editarService(s)" class="text-blue-600 hover:text-blue-800 font-medium"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                            <button type="button" (click)="$event.stopPropagation(); deleteService(s.id)" class="text-red-600 hover:text-red-800 font-medium"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                <div *ngIf="services.length === 0" class="p-6 text-center text-slate-400">
                  No hay services registrados
                </div>
              </div>

              <!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingService || selectedService || selectedServiceId), 'flex': isCreatingService || selectedService || selectedServiceId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!selectedService && !isCreatingService && !selectedServiceId" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p class="font-medium text-lg">Selecciona un service de la lista</p>
                  <p class="text-sm">o registra uno nuevo</p>
                </div>

                <!-- Modo Lectura -->
                <div *ngIf="selectedService && !isCreatingService && !selectedServiceId" class="p-4 md:p-8">
                  <button (click)="selectedService=null" class="md:hidden mb-4 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h4 class="text-2xl font-black text-slate-800">Detalle del Service</h4>
                      <p class="text-indigo-600 font-bold mt-1">Fecha: {{ selectedService.fecha | date:'longDate' }}</p>
                    </div>
                    <button type="button" (click)="$event.preventDefault(); editarService(selectedService)" class="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition flex items-center shadow-sm">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Editar Service
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Veh├¡culo (Patente)</p>
                      <p class="text-slate-800 font-mono font-bold text-lg bg-slate-100 px-3 py-1 rounded inline-block border border-slate-200">{{ selectedService.CamionRel?.patente_chasis || selectedService.patente_chasis }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Kil├│metros Actuales</p>
                      <p class="text-indigo-700 font-black text-2xl">{{ selectedService.km }} KM</p>
                    </div>

                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 col-span-2">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pr├│ximo Cambio de Filtro</p>
                      <p class="text-slate-800 font-bold text-lg">{{ selectedService.proximo_cambio_filtro }} KM</p>
                    </div>
                    
                    <div class="col-span-2">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Checklist de Mantenimiento</p>
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.aceite_motor" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.aceite_motor" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Aceite de Motor</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.aire" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.aire" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Filtro de Aire</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.aceite" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.aceite" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Filtro de Aceite</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.combustible" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.combustible" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Filtro de Combustible</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.hidraulico" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.hidraulico" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Hidr├íulico</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.caja" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.caja" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Caja</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.diferencial" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.diferencial" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Diferencial</span>
                        </div>
                        <div class="flex items-center space-x-2 w-full justify-end md:w-auto mt-2 md:mt-0 relative z-10">
                          <svg *ngIf="selectedService.lubricacion_chasis" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          <svg *ngIf="!selectedService.lubricacion_chasis" class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          <span class="text-slate-700 font-medium">Lubricaci├│n Chasis</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Modo Formulario -->
                <form *ngIf="isCreatingService || selectedServiceId" [formGroup]="serviceForm" class="p-4 md:p-6 space-y-6 w-full max-w-lg mx-auto overflow-y-auto">
                  <button (click)="isCreatingService=false; selectedServiceId=null" class="md:hidden mb-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h4 class="font-black text-xl text-slate-800">{{ selectedServiceId ? 'Editar Service' : 'Nuevo Service' }}</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div class="mb-4 md:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase">Vehículo (Patente)</label>
                        <select formControlName="patente_chasis" class="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                          <option value="" disabled selected>Seleccione un camión</option>
                          <option *ngFor="let c of camiones" [value]="c.patente_chasis">{{ c.patente_chasis }}</option>
                        </select>
                      </div>

                      <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Fecha</label>
                      <input type="date" formControlName="fecha" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Kilómetros Actuales</label>
                      <input type="number" formControlName="km" placeholder="Ej: 125000" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 font-bold">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Próx. Cambio Filtro</label>
                      <input type="number" formControlName="proximo_cambio_filtro" placeholder="Ej: 135000" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 font-mono text-indigo-700">
                    </div>
                  </div>

                  <div class="border-t border-slate-200 pt-5">
                    <h4 class="font-bold text-slate-800 mb-4">Checklist de Mantenimiento</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="aceite_motor" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Aceite Motor</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="aire" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Aire</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="aceite" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Aceite (Filtro)</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="combustible" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Combustible</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="hidraulico" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Hidráulico</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="caja" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Caja</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="diferencial" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Diferencial</span>
                      </label>
                      <label class="flex items-center space-x-3 p-2 bg-white rounded border border-slate-100 hover:border-indigo-300 cursor-pointer transition">
                        <input type="checkbox" formControlName="lubricacion_chasis" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium text-slate-700">Lubricación Chasis</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="flex justify-end pt-4">
                    <button type="button" (click)="$event.preventDefault(); submitService()"  [disabled]="serviceForm.invalid || isLoading" class="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50">Guardar Service</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
<div *ngIf="activeTab === 'camiones'" class="fade-in">
            <div class="flex justify-between items-center border-b pb-2 mb-6">
              <h3 class="text-xl font-bold text-slate-700">Flota Activa</h3>
              <button type="button" (click)="$event.preventDefault(); isCreatingCamion = !isCreatingCamion; isViewingCamion = false; selectedCamionId = null; camionForm.reset()" class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                {{ isCreatingCamion ? 'Cancelar' : 'Nuevo Vehículo' }}
              </button>
            </div>

            <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-12rem)] min-h-[60vh]">
              <!-- Panel Izquierdo -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                
                  <!-- Contenedor Tarjetas Móvil -->
                  <div class="grid grid-cols-1 gap-4 md:hidden p-4">
                    <div *ngFor="let cam of camiones" (click)="verDetalleCamion(cam); isViewingCamion=true" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative" [class.border-indigo-400]="selectedCamion?.id === cam.id">
                      <div class="flex justify-between items-start mb-2">
                        <p class="font-black text-slate-800 text-lg">{{ cam.patente_chasis }}</p>
                      </div>
                      <p class="text-sm text-slate-500 font-medium mb-3">Chofer: {{ cam.UsuarioRel?.email || 'No asignado' }}</p>
                      <div class="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                        <button type="button" (click)="$event.stopPropagation(); editarCamion(cam)" class="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg font-bold text-sm">Editar</button>
                        <button type="button" (click)="$event.stopPropagation(); deleteCamion(cam.id)" class="flex-1 bg-red-50 text-red-700 py-2 rounded-lg font-bold text-sm">Borrar</button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Tabla Escritorio -->
                  <div class="hidden md:block">
                    <table class="w-full text-left">
                      <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Patente</th>
                          <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Chofer</th>
                          <th class="px-4 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr *ngFor="let cam of camiones" (click)="verDetalleCamion(cam); isViewingCamion=true" class="hover:bg-slate-50 cursor-pointer transition-colors" [class.bg-indigo-50]="selectedCamion?.id === cam.id">
                          <td class="px-4 py-3 font-bold text-slate-800">{{ cam.patente_chasis }}</td>
                          <td class="px-4 py-3 text-sm text-slate-500">{{ cam.UsuarioRel?.email || 'No asignado' }}</td>
                          <td class="px-4 py-3 text-right space-x-2">
                            <button type="button" (click)="$event.stopPropagation(); editarCamion(cam)" class="text-blue-600 hover:text-blue-800 font-medium"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                            <button type="button" (click)="$event.stopPropagation(); deleteCamion(cam.id)" class="text-red-600 hover:text-red-800 font-medium"><svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                <div *ngIf="camiones.length === 0" class="p-6 text-center text-slate-400">
                  No hay camiones registrados
                </div>
              </div>

              <!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!isViewingCamion && !isCreatingCamion && !selectedCamionId" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  <p class="font-medium text-lg">Selecciona un vehículo de la lista</p>
                  <p class="text-sm">o registra uno nuevo</p>
                </div>

                <!-- Modo Visor -->
                <div *ngIf="isViewingCamion && selectedCamion" class="p-4 md:p-8">
                  <button (click)="isViewingCamion=false; selectedCamion=null" class="md:hidden mb-4 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h4 class="text-2xl font-black text-slate-800">Detalle del Veh├¡culo</h4>
                    </div>
                    <button type="button" (click)="$event.preventDefault(); editarCamion(selectedCamion)" class="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition flex items-center shadow-sm">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Editar Veh├¡culo
                    </button>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div class="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Patente Chasis</p>
                      <p class="text-slate-800 font-mono font-bold text-2xl">{{ selectedCamion.patente_chasis }}</p>
                    </div>
                    <div class="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Chofer Asignado</p>
                      <p class="text-indigo-700 font-bold text-xl">{{ selectedCamion.chofer_asignado || 'Sin Asignar' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Modo Formulario -->
                <form *ngIf="isCreatingCamion || selectedCamionId" [formGroup]="camionForm" class="p-4 md:p-6 space-y-6 w-full max-w-lg mx-auto overflow-y-auto">
                  <button (click)="isCreatingCamion=false; selectedCamionId=null" class="md:hidden mb-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h4 class="font-black text-xl text-slate-800">{{ selectedCamionId ? 'Editar Vehículo' : 'Alta de Vehículo' }}</h4>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Patente Chasis</label>
                      <input type="text" formControlName="patente_chasis" placeholder="Ej: AB123CD" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors font-mono font-bold">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Chofer Asignado</label>
                      <select formControlName="chofer_asignado" (change)="onChoferChange($event)" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-indigo-700 font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                        <option value="" disabled selected>Seleccione Chofer...</option>
                        <option value="NUEVO" class="font-bold text-indigo-600 bg-indigo-50">+ Agregar Nuevo Chofer...</option>
                        <option *ngFor="let ch of listadoChoferes" [value]="ch.nombre">{{ ch.nombre }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="pt-4 flex flex-col md:flex-row md:justify-end border-t border-slate-100">
                    <button type="button" (click)="$event.preventDefault(); submitCamion()" [disabled]="camionForm.invalid || isLoading" class="w-full md:w-auto px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md mt-4 md:mt-0 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
                      Guardar Vehículo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <!-- VISTAS PROTEGIDAS -->
          <div *ngIf="activeTab === 'panel_admin'" class="fade-in">
            <h3 class="text-xl font-bold text-indigo-900 border-b pb-2 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Supervisor: Control Maestro de Viajes
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-12rem)] min-h-[60vh]">
              <!-- Panel Izquierdo -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let v of viajes" (click)="verDetalleAdminViaje(v); isViewingAdminViaje=true" class="p-4 border-b border-slate-200 hover:bg-white cursor-pointer transition" [class.bg-indigo-50]="selectedAdminViaje?.id === v.id">
                  <p class="font-bold text-slate-800 text-lg">{{ v.chofer_email || 'Sin Asignar' }}</p>
                  <p class="text-sm font-medium text-slate-600 mt-1">{{ v.Origen?.nombre_lugar || v.lugar_salida }} <span class="text-indigo-400 font-bold">&rarr;</span> {{ v.Destino?.nombre_lugar || v.lugar_llegada }}</p>
                  <p class="text-xs text-slate-400 mt-1">{{ v.fecha_salida | date:'shortDate' }} - {{ v.fecha_llegada | date:'shortDate' }}</p>
                </div>
                <div *ngIf="viajes.length === 0" class="p-6 text-center text-slate-400">
                  No hay viajes en el historial
                </div>
              </div>

              <!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                <!-- Estado Vacío -->
                <div *ngIf="!isViewingAdminViaje" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p class="font-medium text-lg">Seleccione un viaje del historial para auditar.</p>
                </div>

                <!-- Modo Visor -->
                <div *ngIf="isViewingAdminViaje && selectedAdminViaje" class="p-4 md:p-8">
                  <button (click)="isViewingAdminViaje=false; selectedAdminViaje=null" class="md:hidden mb-4 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold w-full text-left flex items-center min-h-[44px]"><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Volver a la lista</button>
                  <div class="border-b border-slate-100 pb-6 mb-6">
                    <h4 class="text-2xl font-black text-indigo-900 flex items-center">
                      <svg class="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      Auditoría de Viaje #{{ selectedAdminViaje.id }}
                    </h4>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div class="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Chofer</p>
                      <p class="text-slate-800 font-bold text-lg">{{ selectedAdminViaje.chofer_email || 'Sin Asignar' }}</p>
                    </div>
                    
                    
                    <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Ruta y Tiempos</p>
                      <div class="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
                        <div class="w-5/12">
                          <p class="text-xs text-slate-500 font-bold mb-1">ORIGEN</p>
                          <p class="font-bold text-slate-800">{{ selectedAdminViaje.Origen?.nombre_lugar || selectedAdminViaje.lugar_salida }}</p>
                          <p class="text-sm text-slate-500">{{ selectedAdminViaje.fecha_salida | date:'mediumDate' }} </p>
                        </div>
                        <div class="w-2/12 flex justify-center text-indigo-300">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                        <div class="w-5/12 text-right">
                          <p class="text-xs text-slate-500 font-bold mb-1">DESTINO</p>
                          <p class="font-bold text-slate-800">{{ selectedAdminViaje.Destino?.nombre_lugar || selectedAdminViaje.lugar_llegada }}</p>
                          <p class="text-sm text-slate-500">{{ selectedAdminViaje.fecha_llegada | date:'mediumDate' }} </p>
                        </div>
                      </div>
                    </div>

                    <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Manifiesto de Carga</p>
                      <div class="grid grid-cols-3 gap-4">
                        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Carga</p>
                          <p class="font-bold text-indigo-900">{{ selectedAdminViaje.Carga?.nombre_carga || selectedAdminViaje.carga_transportada }}</p>
                        </div>
                        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Peso</p>
                          <p class="font-bold text-indigo-900">{{ selectedAdminViaje.kg_carga }} kg</p>
                        </div>
                        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <p class="text-xs font-bold text-indigo-400 uppercase mb-1">Distancia</p>
                          <p class="font-bold text-indigo-900">{{ selectedAdminViaje.km_recorridos }} km</p>
                        </div>
                      </div>
                    </div>

                    <div class="col-span-2 border-t border-slate-100 pt-4 mt-2">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Comprobante Respaldatorio</p>
                      <div class="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                          <p class="font-bold text-slate-800">{{ selectedAdminViaje.comprobante_relacionado }}</p>
                          <p class="text-sm text-slate-500 font-mono mt-1">Nº {{ selectedAdminViaje.numero_comprobante }}</p>
                        </div>
                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Registrado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ViajesComponent implements OnInit {
  private ngZone = inject(NgZone);
  activeTab = 'mis_viajes';
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  
  userRole = '';
  userEmail = '';
  hasAdminAccess = false;
  
  isLoading = false;
  isExporting = false;
  viajeForm: FormGroup;
  combustibleForm: FormGroup;
  serviceForm: FormGroup;
  camionForm: FormGroup;

  isCreatingViaje = false;
  isViewingViaje = false;
  selectedViaje: any = null;
  isCreatingCombustible = false;
  isViewingCombustible = false;
  selectedCombustible: any = null;
  isCreatingService = false;
  isCreatingCamion = false;
  isViewingCamion = false;
  selectedCamion: any = null;
  isViewingAdminViaje = false;
  selectedAdminViaje: any = null;

  selectedViajeId: number | null = null;
  selectedCombustibleId: number | null = null;
  selectedServiceId: number | null = null;
  selectedCamionId: number | null = null;

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  selectedService: any = null;

  viajes: any[] = [];
  cargas: any[] = [];
  services: any[] = [];
  camiones: any[] = [];
  listadoChoferes: any[] = [];
  ubicaciones: any[] = [];

  constructor() {
    this.viajeForm = this.fb.group({
      chofer_email: ['', Validators.required],
      lugar_salida: ['', Validators.required],
      fecha_salida: ['', Validators.required],
      lugar_llegada: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      km_recorridos: [null, [Validators.required, Validators.min(1)]],
      carga_transportada: ['', Validators.required],
      kg_carga: [null, [Validators.required, Validators.min(1)]],
      comprobante_relacionado: ['REMITO', Validators.required],
      numero_comprobante: ['', Validators.required]
    });

    this.combustibleForm = this.fb.group({
      patente_chasis: ['', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      litros_gasoil: [null, [Validators.required, Validators.min(0.1)]],
      kilometraje: [null, [Validators.required, Validators.min(1)]],
      foto_tablero: [null],
      consumo: [{value: null, disabled: true}]
    });

    this.serviceForm = this.fb.group({
      patente_chasis: ['', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      km: [null, [Validators.required, Validators.min(1)]],
      proximo_cambio_filtro: [null, [Validators.required, Validators.min(1)]],
      aceite_motor: [false],
      aire: [false],
      aceite: [false],
      combustible: [false],
      hidraulico: [false],
      caja: [false],
      diferencial: [false],
      lubricacion_chasis: [false]
    });

    this.camionForm = this.fb.group({
      patente_chasis: ['', Validators.required],
      chofer_asignado: ['', Validators.required]
    });
  }

    verDetalleAdminViaje(v: any) {
    this.isViewingAdminViaje = true;
    this.selectedAdminViaje = v;
  }

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/logistica/choferes`).subscribe({
      next: (data) => this.ngZone.run(() => this.listadoChoferes = data),
      error: () => console.error('Error cargando choferes')
    });
    const user = this.authService.currentUser();
    if(user) {
      this.userRole = user.role || 'Desconocido';
      this.userEmail = user.email || 'chofer@paoloni.com';
      this.hasAdminAccess = (this.userRole === 'Admin' || this.userRole === 'Logistica');
      this.viajeForm.patchValue({ chofer_email: this.userEmail });
    }
    this.fetchAll();
  }

  fetchAll() {
      this.http.get<any[]>(`${environment.apiUrl}/logistica/viajes`).subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.viajes = data?.data || data || [];
            if (this.viajes && this.viajes.length > 0) {
              console.log('AUDITORIA VIAJE 0:', this.viajes[0]);
            }
          });
        },
        error: (e) => console.error(e)
      });
    this.http.get<any[]>(`${environment.apiUrl}/logistica/combustible`).subscribe({
      next: (data: any) => this.ngZone.run(() => this.cargas = data?.data || data || []),
      error: (e) => console.error(e)
    });
    this.http.get<any[]>(`${environment.apiUrl}/logistica/service`).subscribe({
      next: (data: any) => this.ngZone.run(() => this.services = data?.data || data || []),
      error: (e) => console.error(e)
    });
    this.http.get<any[]>(`${environment.apiUrl}/logistica/camiones`).subscribe({
      next: (data: any) => this.ngZone.run(() => this.camiones = data?.data || data || []),
      error: (e) => console.error(e)
    });
  }

  // --- VIAJES ---
  verDetalleViaje(v: any) {
    this.isCreatingViaje = false;
    this.isViewingViaje = true;
    this.selectedViajeId = null;
    this.selectedViaje = v;
  }

  submitViaje() {
    if (this.viajeForm.invalid) return;
    this.isLoading = true;
    const formValue = this.viajeForm.value;
    
    // El input datetime-local provee un string YYYY-MM-DDTHH:mm
    const extractDate = (dt: string) => dt ? dt.split('T')[0] : '';
    const extractTime = (dt: string) => dt ? dt.split('T')[1] : '';

    const payload = {
      chofer_email: formValue.chofer_email,
      lugar_salida: formValue.lugar_salida,
      fecha_salida: formValue.fecha_salida,
      hora_salida: formValue.hora_salida,
      lugar_llegada: formValue.lugar_llegada,
      fecha_llegada: formValue.fecha_llegada,
      hora_llegada: formValue.hora_llegada,
      km_recorridos: formValue.km_recorridos,
      carga_transportada: formValue.carga_transportada,
      kg_carga: formValue.kg_carga,
      comprobante_relacionado: formValue.comprobante_relacionado,
      numero_comprobante: formValue.numero_comprobante,
      comentarios: ''
    };

    const method = this.selectedViajeId ? this.http.put(`${environment.apiUrl}/logistica/viajes/${this.selectedViajeId}`, payload) : this.http.post(`${environment.apiUrl}/logistica/viajes`, payload);
    
    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Viaje registrado satisfactoriamente.', 'success');
        if (!this.selectedViajeId) this.viajes.unshift(res.data || res);
        else {
          const idx = this.viajes.findIndex(x => x.id === this.selectedViajeId);
          if (idx !== -1) this.viajes[idx] = { ...this.viajes[idx], ...payload };
        }
        this.isLoading = false;
        this.isViewingViaje = true;
        this.isCreatingViaje = false;
        this.selectedViaje = res.data || res;
        this.selectedViajeId = null;
        this.viajeForm.reset({ comprobante_relacionado: 'REMITO', chofer_email: this.userEmail });
      },
      error: (err) => { console.error(err); Swal.fire('Error', 'Ocurrió un error.', 'error'); this.isLoading = false; }
    });
  }

  editarViaje(v: any) {
    this.isViewingViaje = false;
    this.isCreatingViaje = false;
    this.selectedViaje = v;
    this.selectedViajeId = v.id;
    
    const patchData = {
      ...v,
      chofer_email: v.chofer_email || v.chofer || '',
      fecha_salida: v.fecha_salida ? String(v.fecha_salida).substring(0, 10) : '',
      fecha_llegada: v.fecha_llegada ? String(v.fecha_llegada).substring(0, 10) : '',
      
      
    };
    
    this.viajeForm.patchValue(patchData);
  }

  deleteViaje(id: number) {
    Swal.fire({
      title: '¿Eliminar despacho?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/logistica/viajes/${id}`).subscribe({
          next: () => {
            this.viajes = this.viajes.filter(x => x.id !== id);
            Swal.fire('Eliminado', 'Viaje eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'Error eliminando.', 'error')
        });
      }
    });
  }

  // --- COMBUSTIBLE ---
  resetCombustibleForm() {
    this.isCreatingCombustible = !this.isCreatingCombustible;
    this.isViewingCombustible = false;
    this.selectedCombustibleId = null;
    this.combustibleForm.reset({ fecha: new Date().toISOString().split('T')[0] });
  }

  verDetalleCombustible(c: any) {
    this.isCreatingCombustible = false;
    this.isViewingCombustible = true;
    this.selectedCombustibleId = null;
    this.selectedCombustible = c;
  }

  submitCombustible() {
    if (this.combustibleForm.invalid) return;
    this.isLoading = true;
    
    const formData = new FormData();
    const formValues = this.combustibleForm.value;
    
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('foto_tablero', this.selectedFile);
    }
    
    const method = this.selectedCombustibleId ? this.http.put(`${environment.apiUrl}/logistica/combustible/${this.selectedCombustibleId}`, formData) : this.http.post(`${environment.apiUrl}/logistica/combustible`, formData);
    
    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Carga guardada.', 'success');
        this.fetchAll();
        this.isLoading = false;
        this.isCreatingCombustible = false;
        this.isViewingCombustible = true;
        this.selectedCombustible = res.data || res;
        this.selectedCombustibleId = null;
        this.selectedFile = null;
        this.combustibleForm.reset({ fecha: new Date().toISOString().split('T')[0] });
      },
      error: () => { Swal.fire('Error', 'Error guardando carga.', 'error'); this.isLoading = false; }
    });
  }

  editarCombustible(c: any) {
    this.isViewingCombustible = false;
    this.isCreatingCombustible = false;
    this.selectedCombustible = c;
    this.selectedCombustibleId = c.id;
    
    const patchData = { ...c, consumo: c.consumo_l_100km };
    delete patchData.foto_tablero; // Previene el InvalidStateError
    
    this.combustibleForm.patchValue(patchData);
  }

  deleteCombustible(id: number) {
    Swal.fire({
      title: '¿Eliminar carga?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/logistica/combustible/${id}`).subscribe({
          next: () => { this.cargas = this.cargas.filter(c => c.id !== id); Swal.fire('Eliminada', 'Carga eliminada.', 'success'); },
          error: () => Swal.fire('Error', 'Error eliminando.', 'error')
        });
      }
    });
  }

  // --- SERVICE ---
  verDetalleService(s: any) {
    this.isCreatingService = false;
    this.selectedServiceId = null;
    this.selectedService = s;
  }

  
  resetServiceForm() {
    this.isCreatingService = !this.isCreatingService;
    this.selectedService = null;
    this.selectedServiceId = null;
    this.serviceForm.reset({ fecha: new Date().toISOString().split('T')[0] });
  }

  submitService() {
    if (this.serviceForm.invalid) return;
    this.isLoading = true;
    
    const method = this.selectedServiceId ? this.http.put(`${environment.apiUrl}/logistica/service/${this.selectedServiceId}`, this.serviceForm.value) : this.http.post(`${environment.apiUrl}/logistica/service`, this.serviceForm.value);
    
    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Service guardado.', 'success');
        if (!this.selectedServiceId) this.services.unshift(res.data || res);
        else {
          const idx = this.services.findIndex(x => x.id === this.selectedServiceId);
          if (idx !== -1) this.services[idx] = { ...this.services[idx], ...this.serviceForm.value };
        }
        this.isLoading = false;
        this.isCreatingService = false;
        this.selectedService = res.data || res;
        this.selectedServiceId = null;
        this.selectedFile = null;
        this.serviceForm.reset({ fecha: new Date().toISOString().split('T')[0] });
      },
      error: () => { Swal.fire('Error', 'Error guardando service.', 'error'); this.isLoading = false; }
    });
  }

  editarService(s: any) {
    this.selectedServiceId = s.id;
    this.isCreatingService = false;
    this.selectedService = null;
    const patchData = { ...s };
    this.serviceForm.patchValue(patchData);
  }

  deleteService(id: number) {
    Swal.fire({
      title: '¿Eliminar service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/logistica/service/${id}`).subscribe({
          next: () => { this.services = this.services.filter(s => s.id !== id); Swal.fire('Eliminado', 'Service eliminado.', 'success'); },
          error: () => Swal.fire('Error', 'Error eliminando.', 'error')
        });
      }
    });
  }

  // --- CAMIONES ---
  
  verDetalleCamion(c: any) {
    this.isCreatingCamion = false;
    this.isViewingCamion = true;
    this.selectedCamionId = null;
    this.selectedCamion = c;
  }

    onChoferChange(event: any) {
    if (event.target.value === 'NUEVO') {
      Swal.fire({
        title: 'Nuevo Chofer',
        input: 'text',
        inputPlaceholder: 'Nombre completo',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.http.post(`${environment.apiUrl}/logistica/choferes`, { nombre: result.value }).subscribe({
            next: (res: any) => {
              const nuevoChofer = res.data || res;
              this.listadoChoferes.push(nuevoChofer);
              this.camionForm.get('chofer_asignado')?.setValue(nuevoChofer.nombre);
              Swal.fire('Guardado', 'Chofer guardado en la base de datos.', 'success');
            },
            error: () => Swal.fire('Error', 'No se pudo guardar el chofer.', 'error')
          });
        } else {
          this.camionForm.get('chofer_asignado')?.setValue('');
        }
      });
    }
  }

  submitCamion() {
    if (this.camionForm.invalid) return;
    this.isLoading = true;
    const method = this.selectedCamionId ? this.http.put(`${environment.apiUrl}/logistica/camiones/${this.selectedCamionId}`, this.camionForm.value) : this.http.post(`${environment.apiUrl}/logistica/camiones`, this.camionForm.value);
    
    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Camión registrado.', 'success');
        if (!this.selectedCamionId) this.camiones.unshift(res.data || res);
        else {
          const idx = this.camiones.findIndex(x => x.id === this.selectedCamionId);
          if (idx !== -1) this.camiones[idx] = { ...this.camiones[idx], ...this.camionForm.value };
        }
        this.isLoading = false;
        this.isViewingCamion = true;
        this.isCreatingCamion = false;
        this.selectedCamion = res.data || res;
        this.selectedCamionId = null;
        this.camionForm.reset();
      },
      error: (err) => { Swal.fire('Error', err.error?.error || 'Error registrando camión.', 'error'); this.isLoading = false; }
    });
  }

  editarCamion(c: any) {
    this.isViewingCamion = false;
    this.isCreatingCamion = false;
    this.selectedCamion = c;
    this.selectedCamionId = c.id;
    this.camionForm.patchValue(c);
  }

  deleteCamion(id: number) {
    Swal.fire({
      title: '¿Eliminar camión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/logistica/camiones/${id}`).subscribe({
          next: () => { this.camiones = this.camiones.filter(c => c.id !== id); Swal.fire('Eliminado', 'Camión eliminado.', 'success'); },
          error: () => Swal.fire('Error', 'Error eliminando.', 'error')
        });
      }
    });
  }



  verDetalle(item: any) {
    if (!item) return;
    let html = '<div class="text-left text-sm" style="max-height: 400px; overflow-y: auto;">';
    const excludedKeys = ['id', 'createdAt', 'updatedAt', 'vehiculo_id', 'chofer_id', 'firma_inspector', 'firma_chofer', 'foto'];
    
    for (let key in item) {
      if (excludedKeys.includes(key)) continue;
      let formattedKey = key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      let value = item[key];
      if (value === null || value === undefined || value === '') value = '-';
      html += '<p><strong>' + formattedKey + ':</strong> ' + value + '</p>';
    }

    if (item.firma_inspector || item.firma_chofer || item.foto) {
        html += '<div class="mt-4">';
        if (item.foto) html += '<p class="font-bold text-slate-600 mb-1">Evidencia Fotográfica:</p><img src="' + this.getImageUrl(item.foto) + '" class="w-full max-w-xs border rounded">';
        if (item.firma_inspector) html += '<p class="font-bold text-slate-600 mb-1 mt-2">Firma Inspector:</p><img src="' + item.firma_inspector + '" class="w-full max-w-xs border rounded">';
        if (item.firma_chofer) html += '<p class="font-bold text-slate-600 mb-1 mt-2">Firma Chofer:</p><img src="' + item.firma_chofer + '" class="w-full max-w-xs border rounded">';
        html += '</div>';
    }
    
    html += '</div>';

    Swal.fire({
      title: "Detalle del Registro",
      html: html,
      width: "600px",
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}