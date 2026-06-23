import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-higiene',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `    <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 w-full relative">
      
      <!-- Izquierda: Lista de Historial -->
      <div class="w-full md:w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-y-auto max-h-[80vh] md:max-h-full" 
           [ngClass]="{'hidden md:flex flex-col': isCreating || isViewing || isEditing, 'flex flex-col': !(isCreating || isViewing || isEditing)}">
        <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-slate-800">Control de Higiene de Carga de Producto Terminado</h2>
            <p class="text-sm text-slate-500 font-medium">Registros</p>
          </div>
          <button type="button" (click)="$event.preventDefault(); crearNuevo()" class="hidden md:flex px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nuevo
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div *ngFor="let h of historial" 
               (click)="verDetalle(h)"
               [class.border-indigo-500]="selectedRecord?.id === h.id"
               [class.bg-indigo-50]="selectedRecord?.id === h.id"
               class="p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 cursor-pointer transition">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Control</span>
              <span class="text-xs text-slate-400 font-bold">{{ h.fecha }}</span>
            </div>
            <p class="font-bold text-slate-700">Transporte: {{ h.transporte }}</p>
            <p class="text-sm text-slate-500">Datos Vehículo: {{ h.patente }}</p>
            <div class="flex justify-end items-center mt-2 pt-2 border-t border-slate-100">
              <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); editar(h)" class="p-2 min-h-[44px] min-w-[44px] text-blue-600 hover:bg-blue-50 rounded transition mr-1 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); delete(h.id)" class="p-2 min-h-[44px] min-w-[44px] text-red-600 hover:bg-red-50 rounded transition flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
          <p *ngIf="historial.length === 0" class="text-center text-slate-400 py-4 text-sm">No hay controles de higiene registrados.</p>
        </div>
      </div>

      <!-- Derecha: Visualización / Wizard -->
      <div class="w-full md:w-2/3 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-y-auto" 
           [ngClass]="{'hidden md:flex flex-col': !(isCreating || isViewing || isEditing), 'flex flex-col h-full w-full': isCreating || isViewing || isEditing}">
        
        <!-- Estado Vacío -->
        <div *ngIf="!isCreating && !isViewing && !isEditing" class="h-full hidden md:flex flex-col items-center justify-center text-slate-400 bg-slate-50/80 z-10 absolute inset-0">
          <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-xl font-bold text-slate-600">Ningún Registro Seleccionado</h3>
          <p class="text-slate-500 mt-1">Seleccione un control del historial o cree uno nuevo.</p>
        </div>

        <button *ngIf="isCreating || isViewing || isEditing" (click)="isCreating=false; isViewing=false; isEditing=false; selectedRecord=null" class="md:hidden m-4 w-[calc(100%-2rem)] bg-slate-100 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center text-lg shadow-sm active:scale-95 transition-all">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          Volver a la Lista
        </button>

        <!-- Módulo de Lectura (isViewing) -->
        <div *ngIf="isViewing && selectedRecord" class="p-6 md:p-8 space-y-6 fade-in h-full overflow-y-auto">
          <div class="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 gap-4">
            <h3 class="text-2xl font-bold text-slate-800">Reporte #{{ selectedRecord.id }}</h3>
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm w-fit">{{ selectedRecord.fecha }}</span>
          </div>

          <!-- A. Cabecera -->
          <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Transporte / Datos Vehículo</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ selectedRecord.transporte }} ({{ selectedRecord.patente }})</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Habilitación Transporte</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ parseBoolean(selectedRecord.habilitacion_transporte) === true ? 'SÍ' : (parseBoolean(selectedRecord.habilitacion_transporte) === false ? 'NO' : 'S/D') }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Chofer / DNI</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ selectedRecord.chofer }} (DNI: {{ selectedRecord.dni_chofer || 'S/D' }})</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">C.M.A.</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ parseBoolean(selectedRecord.cma) === true ? 'SÍ' : (parseBoolean(selectedRecord.cma) === false ? 'NO' : 'S/D') }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Cliente</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ selectedRecord.cliente }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Producto / Lote</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ selectedRecord.producto }} (Lote: {{ selectedRecord.n_lote || 'S/D' }})</span></div>
            <div class="md:col-span-2"><span class="text-xs font-bold text-slate-400 block uppercase">Tipo Envase</span> <span class="font-bold text-slate-700 text-lg md:text-base">{{ selectedRecord.tipo_envase || 'S/D' }}</span></div>
          </div>

          <!-- B. Checklist de Higiene -->
          <h4 class="text-lg font-bold text-slate-800 mt-6 mb-2">Checklist de Higiene y Observaciones</h4>
          <div class="flex flex-col space-y-4">
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Higiene Externa (Sin polvo/manchas)', val: selectedRecord.chk_externa, obs: selectedRecord.obs_externa }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Libre de Insectos en Exterior', val: selectedRecord.chk_insectos, obs: selectedRecord.obs_insectos }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Film de Polietileno (Debajo y Arriba)', val: selectedRecord.chk_film, obs: selectedRecord.obs_film }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Mercadería Seca (Sin humedad)', val: selectedRecord.chk_humedad, obs: selectedRecord.obs_humedad }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Transporte Limpio y Seco (Interior)', val: selectedRecord.chk_interior, obs: selectedRecord.obs_interior }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Transportista verificó bolsas durante carga', val: selectedRecord.chk_verificacion, obs: selectedRecord.obs_verificacion }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Aplicación de Insecticida Exterior', val: selectedRecord.chk_insecticida, obs: selectedRecord.obs_insecticida }"></ng-container>
          </div>

          <ng-template #checkItem let-title="title" let-val="val" let-obs="obs">
            <div class="p-4 border rounded-xl shadow-sm flex flex-col" [ngClass]="{'bg-red-50 border-red-200': parseBoolean(val) === false, 'bg-green-50 border-green-200': parseBoolean(val) === true, 'bg-slate-50 border-slate-200': parseBoolean(val) === null}">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span class="font-bold text-slate-700 text-lg md:text-base">{{ title }}</span>
                <span class="font-black px-4 py-2 md:px-3 md:py-1 rounded text-sm w-fit" [ngClass]="{'bg-red-200 text-red-800': parseBoolean(val) === false, 'bg-green-200 text-green-800': parseBoolean(val) === true, 'bg-slate-200 text-slate-600': parseBoolean(val) === null}">
                  {{ parseBoolean(val) === true ? 'SÍ CUMPLE' : (parseBoolean(val) === false ? 'NO CUMPLE' : 'S/D') }}
                </span>
              </div>
              <div *ngIf="obs" class="mt-3 text-base md:text-sm text-slate-600 italic border-t border-slate-200/50 pt-3">
                <span class="font-bold text-slate-500 not-italic">Observación:</span> {{ obs }}
              </div>
            </div>
          </ng-template>

          <!-- Firmas en la vista Detalles -->
          <h3 class="font-bold text-lg text-slate-700 mt-6 mb-3">Firmas</h3>
          <div class="flex flex-col md:grid md:grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
              <p class="text-sm font-bold text-indigo-700 mb-2">Inspector Calidad</p>
              <img *ngIf="selectedRecord.firma_inspector" [src]="selectedRecord.firma_inspector" class="max-h-24 bg-white border border-slate-200 rounded">
              <p *ngIf="!selectedRecord.firma_inspector" class="text-sm text-slate-400 italic">Sin firma</p>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
              <p class="text-sm font-bold text-slate-700 mb-2">Chofer Transporte</p>
              <img *ngIf="selectedRecord.firma_chofer" [src]="selectedRecord.firma_chofer" class="max-h-24 bg-white border border-slate-200 rounded">
              <p *ngIf="!selectedRecord.firma_chofer" class="text-sm text-slate-400 italic">Sin firma</p>
            </div>
          </div>

          <!-- C. Cierre y Detalles Generales -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-6 flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <div><span class="text-xs font-bold text-indigo-400 block uppercase">Estado del Clima</span> <span class="font-bold text-indigo-900 text-lg md:text-base">{{ selectedRecord.estado_clima || 'S/D' }}</span></div>
            <div><span class="text-xs font-bold text-indigo-400 block uppercase">Responsable Inspección</span> <span class="font-bold text-indigo-900 text-lg md:text-base">{{ selectedRecord.responsable_inspeccion || 'S/D' }}</span></div>
            <div class="md:col-span-2"><span class="text-xs font-bold text-indigo-400 block uppercase">Observaciones Generales</span> <span class="text-indigo-900 text-lg md:text-base">{{ selectedRecord.observaciones_generales || 'Ninguna' }}</span></div>
          </div>
          
          <!-- D. Evidencia Fotográfica -->
          <h3 *ngIf="selectedRecord.foto_1 || selectedRecord.foto_2 || selectedRecord.foto_3 || selectedRecord.foto_4 || selectedRecord.foto_5 || selectedRecord.foto_6" class="font-bold text-lg text-slate-700 mt-6 mb-3">Evidencia Fotográfica</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div *ngFor="let i of [1,2,3,4,5,6]">
              <img *ngIf="selectedRecord['foto_'+i]" [src]="getImageUrl(selectedRecord['foto_'+i])" class="w-full h-32 object-cover rounded shadow-sm border border-slate-200">
            </div>
          </div>
          
          <div class="flex justify-end mt-6 pt-4 border-t border-slate-100">
             <button type="button" (click)="selectedRecord = null; isViewing = false" class="w-full md:w-auto px-6 py-4 md:py-2 bg-slate-200 text-slate-700 font-bold rounded-xl md:rounded-lg hover:bg-slate-300 transition text-xl md:text-base">Cerrar Detalles</button>
          </div>
        </div>

        <!-- Módulo Wizard de Creación/Edición -->
        <div *ngIf="isCreating || isEditing" class="flex-1 overflow-y-auto p-4 md:p-8 fade-in">
          <!-- Stepper Visual -->
          <div class="flex items-center mb-8 relative px-2">
            <div class="absolute inset-0 flex items-center justify-center z-0 px-6">
              <div class="w-full h-1 bg-slate-200 absolute"></div>
              <div class="h-1 bg-indigo-600 absolute left-0 transition-all duration-300" [style.width]="(currentStep - 1) * 50 + '%'"></div>
            </div>
            
            <div class="relative z-10 flex w-full justify-between">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-md" [ngClass]="currentStep >= 1 ? 'bg-indigo-600' : 'bg-slate-300'">1</div>
                <span class="text-xs font-bold mt-2 text-slate-600">Viaje</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-md" [ngClass]="currentStep >= 2 ? 'bg-indigo-600' : 'bg-slate-300'">2</div>
                <span class="text-xs font-bold mt-2 text-slate-600">Checklist</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-md" [ngClass]="currentStep >= 3 ? 'bg-indigo-600' : 'bg-slate-300'">3</div>
                <span class="text-xs font-bold mt-2 text-slate-600">Cierre</span>
              </div>
            </div>
          </div>

          <form [formGroup]="wizardForm">
            <!-- PASO 1: Datos del Viaje -->
            <div *ngIf="currentStep === 1" class="space-y-6 fade-in">
              <h3 class="text-xl md:text-2xl font-black text-slate-700 border-b pb-2">Fase 1: Datos Generales</h3>
              <div class="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Fecha</label>
                  <input type="date" formControlName="fecha" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
                <div class="flex flex-col relative">
                  <label class="text-base font-bold text-slate-700 mb-2">Transporte / Empresa</label>
                  <div class="relative">
                    <input type="text" formControlName="transporte" (focus)="showTransporteList = true" (blur)="hideTransporteListDelay()" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base pr-10" placeholder="Escriba o seleccione...">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <div *ngIf="showTransporteList" class="absolute top-[85px] z-50 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div *ngFor="let item of getFilteredTransportes()" (click)="selectTransporte(item)" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 font-medium">
                      {{ item }}
                    </div>
                    <div *ngIf="getFilteredTransportes().length === 0 && wizardForm.get('transporte')?.value" (click)="addTransporte()" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-600 font-bold bg-indigo-50/50 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      Agregar "{{ wizardForm.get('transporte')?.value }}"
                    </div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Datos Vehículo</label>
                  <input type="text" formControlName="patente" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Habilitación Transporte</label>
                  <select formControlName="habilitacion_transporte" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-white text-gray-800 focus:ring-indigo-500 text-lg md:text-base">
                    <option value="Y">Sí (Y)</option>
                    <option value="N">No (N)</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Chofer</label>
                  <input type="text" formControlName="chofer" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">DNI Chofer</label>
                  <input type="text" formControlName="dni_chofer" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">C.M.A.</label>
                  <select formControlName="cma" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-white text-gray-800 focus:ring-indigo-500 text-lg md:text-base">
                    <option value="Y">Sí (Y)</option>
                    <option value="N">No (N)</option>
                  </select>
                </div>
                <div class="flex flex-col relative">
                  <label class="text-base font-bold text-slate-700 mb-2">Cliente / Destino</label>
                  <div class="relative">
                    <input type="text" formControlName="cliente" (focus)="showClienteList = true" (blur)="hideClienteListDelay()" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base pr-10" placeholder="Escriba o seleccione...">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <div *ngIf="showClienteList" class="absolute top-[85px] z-50 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div *ngFor="let item of getFilteredClientes()" (click)="selectCliente(item)" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 font-medium">
                      {{ item }}
                    </div>
                    <div *ngIf="getFilteredClientes().length === 0 && wizardForm.get('cliente')?.value" (click)="addCliente()" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-600 font-bold bg-indigo-50/50 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      Agregar "{{ wizardForm.get('cliente')?.value }}"
                    </div>
                  </div>
                </div>
                <div class="flex flex-col relative">
                  <label class="text-base font-bold text-slate-700 mb-2">Producto</label>
                  <div class="relative">
                    <input type="text" formControlName="producto" (focus)="showProductoList = true" (blur)="hideProductoListDelay()" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base pr-10" placeholder="Escriba o seleccione...">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <div *ngIf="showProductoList" class="absolute top-[85px] z-50 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div *ngFor="let item of getFilteredProductos()" (click)="selectProducto(item)" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 font-medium">
                      {{ item }}
                    </div>
                    <div *ngIf="getFilteredProductos().length === 0 && wizardForm.get('producto')?.value" (click)="addProducto()" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-600 font-bold bg-indigo-50/50 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      Agregar "{{ wizardForm.get('producto')?.value }}"
                    </div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Tipo Envase</label>
                  <select formControlName="tipo_envase" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-white text-gray-800 focus:ring-indigo-500 text-lg md:text-base">
                    <option value="" disabled>Seleccione...</option>
                    <option value="BIG BAG">BIG BAG</option>
                    <option value="BOLSA">BOLSA</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">N° Lote</label>
                  <input type="text" formControlName="n_lote" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
              </div>
              
              <div class="flex justify-end mt-8 pt-4 border-t border-slate-100">
                <button type="button" (click)="$event.preventDefault(); nextStep()" class="w-full md:w-auto px-8 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl hover:bg-indigo-700 transition">Siguiente</button>
              </div>
            </div>

            <!-- PASO 2: Checklist -->
            <div *ngIf="currentStep === 2" class="space-y-6 fade-in">
              <h3 class="text-xl md:text-2xl font-black text-slate-700 border-b pb-2">Fase 2: Checklist de Higiene</h3>
              
              <div class="flex flex-col space-y-6">
                <div *ngFor="let item of checkItems" class="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex flex-col">
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2">
                    <span class="text-lg md:text-xl font-black text-slate-700">{{ item.label }}</span>
                    <!-- Botones Mutantes CUMPLE / NO CUMPLE -->
                    <div class="flex mt-3 md:mt-0 w-full md:w-auto space-x-2">
                      <button type="button" (click)="setCheck(item.controlName, 'Y')" 
                        [class]="wizardForm.get(item.controlName)?.value === 'Y' ? 'bg-green-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'"
                        class="flex-1 md:flex-none px-4 py-4 md:py-2 rounded-xl font-black text-lg md:text-base transition-all duration-200">
                        SÍ
                      </button>
                      <button type="button" (click)="setCheck(item.controlName, 'N')" 
                        [class]="wizardForm.get(item.controlName)?.value === 'N' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'"
                        class="flex-1 md:flex-none px-4 py-4 md:py-2 rounded-xl font-black text-lg md:text-base transition-all duration-200">
                        NO
                      </button>
                    </div>
                  </div>
                  <!-- Observaciones Libres -->
                  <div class="mt-2 fade-in">
                    <textarea [formControlName]="item.obsName" rows="2" placeholder="Observaciones (Opcional si Cumple, Obligatorio si No Cumple)..." class="w-full border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 py-4 md:py-3 px-4 text-lg md:text-base"></textarea>
                  </div>
                </div>
              </div>

              <div class="flex flex-col md:flex-row justify-between mt-8 pt-4 border-t border-slate-100 gap-4">
                <button type="button" (click)="$event.preventDefault(); prevStep()" class="w-full md:w-auto px-8 py-4 md:py-3 bg-slate-200 text-slate-700 font-bold text-xl md:text-base rounded-xl hover:bg-slate-300 transition">Volver</button>
                <button type="button" (click)="$event.preventDefault(); nextStep()" class="w-full md:w-auto px-8 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl hover:bg-indigo-700 transition">Siguiente</button>
              </div>
            </div>

            <!-- PASO 3: Cierre y Firmas -->
            <div *ngIf="currentStep === 3" class="space-y-6 fade-in">
              <h3 class="text-xl md:text-2xl font-black text-slate-700 border-b pb-2">Fase 3: Cierre y Firmas</h3>

              <div class="flex flex-col space-y-4 md:gap-6 mb-6">
                <!-- 1. Estado del Clima -->
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Estado del Clima</label>
                  <input type="text" formControlName="estado_clima" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base">
                </div>
                
                <!-- 2. Observaciones Generales -->
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Observaciones Generales</label>
                  <textarea formControlName="observaciones_generales" rows="4" class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-50 focus:ring-indigo-500 text-lg md:text-base"></textarea>
                </div>

                <!-- 3. Evidencia Visual -->
                <div class="flex flex-col">
                  <h3 class="font-bold text-lg text-slate-700 mt-4 mb-3">Evidencia Fotográfica</h3>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-slate-50 p-3 border border-slate-200 rounded-xl flex flex-col items-center justify-center relative">
                      <label class="text-sm font-bold text-slate-600 mb-2">Foto {{i}}</label>
                      <input type="file" accept="image/*" capture="environment" (change)="onFileSelected($event, i)" class="hidden" [id]="'foto_'+i">
                      <label [for]="'foto_'+i" class="cursor-pointer bg-white border border-slate-300 rounded p-2 text-xs text-center w-full hover:bg-slate-50 transition shadow-sm font-bold text-slate-700">Seleccionar Imagen</label>
                      <!-- Preview -->
                      <div *ngIf="previews['foto_'+i] || (selectedRecord && selectedRecord['foto_'+i])" class="mt-2 w-full">
                        <img [src]="previews['foto_'+i] || getImageUrl(selectedRecord['foto_'+i])" class="w-full h-24 object-cover rounded shadow-sm border border-slate-200">
                        <button type="button" (click)="removePhoto(i)" class="mt-1 text-xs text-red-500 hover:text-red-700 font-bold w-full text-center py-1">Remover</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 4. Responsable de Inspección -->
                <div class="flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2">Responsable de Inspección</label>
                  <input type="text" formControlName="responsable_inspeccion" readonly class="w-full border-slate-300 rounded-xl shadow-sm py-4 md:py-3 px-4 bg-slate-200 text-slate-600 cursor-not-allowed focus:ring-indigo-500 text-lg md:text-base">
                </div>
              </div>

              <!-- Firmas -->
              <div class="flex flex-col space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 mt-6 border-t border-slate-200 pt-6">
                <!-- Firma Inspector -->
                <div class="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col">
                  <label class="text-base font-bold text-indigo-700 mb-2 flex justify-between items-center">
                    <span>Firma Inspector Calidad</span>
                    <button type="button" (click)="clearCanvas('inspector')" class="text-sm text-slate-500 hover:text-red-500 underline px-3 py-2 bg-white rounded shadow-sm">Borrar</button>
                  </label>
                  <canvas *ngIf="!selectedRecord?.firma_inspector" #canvasInspector width="300" height="150" class="bg-white border-2 border-dashed border-indigo-200 w-full rounded-xl cursor-crosshair touch-none"
                    (mousedown)="startDrawing($event, 'inspector')" (mousemove)="draw($event, ctxInspector)" (mouseup)="stopDrawing()" (mouseleave)="stopDrawing()"
                    (touchstart)="startDrawingTouch($event, 'inspector')" (touchmove)="drawTouch($event, ctxInspector)" (touchend)="stopDrawing()"></canvas>
                  <img *ngIf="selectedRecord?.firma_inspector" [src]="selectedRecord.firma_inspector" class="bg-white border-2 border-dashed border-indigo-200 w-full rounded max-h-[150px] object-contain">
                </div>

                <!-- Firma Chofer -->
                <div class="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col">
                  <label class="text-base font-bold text-slate-700 mb-2 flex justify-between items-center">
                    <span>Firma Chofer Transporte</span>
                    <button type="button" (click)="clearCanvas('chofer')" class="text-sm text-slate-500 hover:text-red-500 underline px-3 py-2 bg-white rounded shadow-sm">Borrar</button>
                  </label>
                  <canvas *ngIf="!selectedRecord?.firma_chofer" #canvasChofer width="300" height="150" class="bg-white border-2 border-dashed border-slate-300 w-full rounded-xl cursor-crosshair touch-none"
                    (mousedown)="startDrawing($event, 'chofer')" (mousemove)="draw($event, ctxChofer)" (mouseup)="stopDrawing()" (mouseleave)="stopDrawing()"
                    (touchstart)="startDrawingTouch($event, 'chofer')" (touchmove)="drawTouch($event, ctxChofer)" (touchend)="stopDrawing()"></canvas>
                  <img *ngIf="selectedRecord?.firma_chofer" [src]="selectedRecord.firma_chofer" class="bg-white border-2 border-dashed border-slate-300 w-full rounded max-h-[150px] object-contain">
                </div>
              </div>

              <!-- Botones Finales -->
              <div class="flex flex-col-reverse md:flex-row justify-between mt-8 pt-4 border-t border-slate-100 gap-4">
                <button type="button" (click)="$event.preventDefault(); prevStep()" class="w-full md:w-auto px-8 py-4 md:py-3 bg-slate-200 text-slate-700 font-bold text-xl md:text-base rounded-xl hover:bg-slate-300 transition">Volver</button>
                <button type="button" (click)="submitForm()" [disabled]="isLoading" class="w-full md:w-auto px-8 py-4 md:py-3 bg-green-600 text-white font-black text-xl md:text-base rounded-xl hover:bg-green-700 shadow-md transition disabled:opacity-50">
                  {{ isLoading ? 'Procesando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- BOTÓN FLOTANTE FAB GLOBAL HIGIENE -->
      <button *ngIf="!(isCreating || isViewing || isEditing)" 
              (click)="crearNuevo()" 
              class="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-black z-[60] hover:bg-indigo-700 active:scale-95 transition-transform border-4 border-white">
        +
      </button>

    </div>
`,
  styles: [`
    .fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HigieneComponent implements AfterViewInit {

  parseBoolean(val: any): boolean | null {
    if (val === null || val === undefined || val === '') return null;
    const str = String(val).toUpperCase().trim();
    if (str === 'TRUE' || str === 'SI' || str === 'Y') return true;
    if (str === 'FALSE' || str === 'NO' || str === 'N') return false;
    return null;
  }
  currentStep = 1;
  isLoading = false;

  isCreating = false;
  isViewing = false;
  isEditing = false;
  selectedId: any = null;
  selectedRecord: any = null;
  historial: any[] = [];

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  wizardForm: FormGroup;

  transportes: string[] = [];
  clientes: string[] = [];
  productos: string[] = [];
  
  showTransporteList = false;
  showClienteList = false;
  showProductoList = false;
  
  previews: any = {};
  compressedFiles: any = {};

  checkItems = [
    { label: 'Higiene Externa (Muestra sin polvo/manchas)', controlName: 'chk_externa', obsName: 'obs_externa' },
    { label: 'Insectos Exterior', controlName: 'chk_insectos', obsName: 'obs_insectos' },
    { label: 'Tiene Film de polietileno para proteger la MERCADERIA (debajo y arriba)?', controlName: 'chk_film', obsName: 'obs_film' },
    { label: 'La MERCADERIA se observa seca sin manchas de humedad?', controlName: 'chk_humedad', obsName: 'obs_humedad' },
    { label: 'El TRANSPORTE (piso, paredes y lona) se encuentra limpio y seco?', controlName: 'chk_interior', obsName: 'obs_interior' },
    { label: 'El transportista verificó el estado de los bigbags o bolsas durante la carga?', controlName: 'chk_verificacion', obsName: 'obs_verificacion' },
    { label: 'Se hizo aplicación de insecticida en la parte exterior de los bigbags o bolsas?', controlName: 'chk_insecticida', obsName: 'obs_insecticida' }
  ];

  @ViewChild('canvasInspector') canvasInspectorRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasChofer') canvasChoferRef!: ElementRef<HTMLCanvasElement>;
  
  ctxInspector!: CanvasRenderingContext2D | null;
  ctxChofer!: CanvasRenderingContext2D | null;
  isDrawing = false;

  constructor() {
    this.wizardForm = this.fb.group({
      // A. Cabecera y Datos Generales
      fecha: ['', Validators.required],
      transporte: ['', Validators.required],
      chofer: ['', Validators.required],
      cliente: ['', Validators.required],
      producto: ['', Validators.required],
      patente: ['', Validators.required],
      habilitacion_transporte: ['Y', Validators.required],
      dni_chofer: ['', Validators.required],
      cma: ['Y', Validators.required],
      tipo_envase: ['', Validators.required],
      n_lote: ['', Validators.required],

      // B. Checklist de Higiene (14 campos: pares de Y/N y Observaciones)
      chk_externa: ['Y', Validators.required], obs_externa: [''],
      chk_insectos: ['Y', Validators.required], obs_insectos: [''],
      chk_film: ['Y', Validators.required], obs_film: [''],
      chk_humedad: ['Y', Validators.required], obs_humedad: [''],
      chk_interior: ['Y', Validators.required], obs_interior: [''],
      chk_verificacion: ['Y', Validators.required], obs_verificacion: [''],
      chk_insecticida: ['Y', Validators.required], obs_insecticida: [''],

      // C. Cierre y Firmas
      estado_clima: ['', Validators.required],
      observaciones_generales: [''],
      responsable_inspeccion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadHistorial();
    this.loadDatalists();
  }

  loadDatalists() {
    this.transportes = JSON.parse(localStorage.getItem('lista_transportes') || '[]');
    this.clientes = JSON.parse(localStorage.getItem('lista_clientes') || '[]');
    this.productos = JSON.parse(localStorage.getItem('lista_productos') || '[]');
  }

  saveDatalists(transporte: string, cliente: string, producto: string) {
    if (transporte && !this.transportes.includes(transporte)) {
      this.transportes.push(transporte);
      localStorage.setItem('lista_transportes', JSON.stringify(this.transportes));
    }
    if (cliente && !this.clientes.includes(cliente)) {
      this.clientes.push(cliente);
      localStorage.setItem('lista_clientes', JSON.stringify(this.clientes));
    }
    if (producto && !this.productos.includes(producto)) {
      this.productos.push(producto);
      localStorage.setItem('lista_productos', JSON.stringify(this.productos));
    }
  }

  loadHistorial() {
    this.historial = [];
    this.http.get<any[]>(`${environment.apiUrl}/calidad/higiene-carga`).subscribe({
      next: (res) => {
        if (res && res.length > 0) this.historial = res;
      },
      error: (err) => console.error('Error cargando historial de higiene', err)
    });
  }

  hideTransporteListDelay() { setTimeout(() => this.showTransporteList = false, 200); }
  hideClienteListDelay() { setTimeout(() => this.showClienteList = false, 200); }
  hideProductoListDelay() { setTimeout(() => this.showProductoList = false, 200); }

  getFilteredTransportes() {
    const val = this.wizardForm.get('transporte')?.value?.toLowerCase() || '';
    return this.transportes.filter(t => t.toLowerCase().includes(val));
  }
  selectTransporte(val: string) {
    this.wizardForm.patchValue({ transporte: val });
    this.showTransporteList = false;
  }
  addTransporte() {
    const val = this.wizardForm.get('transporte')?.value;
    if (val) this.selectTransporte(val);
  }

  getFilteredClientes() {
    const val = this.wizardForm.get('cliente')?.value?.toLowerCase() || '';
    return this.clientes.filter(t => t.toLowerCase().includes(val));
  }
  selectCliente(val: string) {
    this.wizardForm.patchValue({ cliente: val });
    this.showClienteList = false;
  }
  addCliente() {
    const val = this.wizardForm.get('cliente')?.value;
    if (val) this.selectCliente(val);
  }

  getFilteredProductos() {
    const val = this.wizardForm.get('producto')?.value?.toLowerCase() || '';
    return this.productos.filter(t => t.toLowerCase().includes(val));
  }
  selectProducto(val: string) {
    this.wizardForm.patchValue({ producto: val });
    this.showProductoList = false;
  }
  addProducto() {
    const val = this.wizardForm.get('producto')?.value;
    if (val) this.selectProducto(val);
  }

  crearNuevo() {
    this.isCreating = true;
    this.isViewing = false;
    this.isEditing = false;
    this.selectedId = null;
    this.selectedRecord = null;
    this.currentStep = 1;
    this.wizardForm.reset();
    this.previews = {};
    this.compressedFiles = {};
    
    // Autocompletar el Responsable de Inspección con el usuario logueado
    const user = this.authService.currentUser();
    const nombreResponsable = user ? (user.username || user.email) : '';
    
    // Set default values for Y/N
    this.wizardForm.patchValue({
      habilitacion_transporte: 'Y',
      cma: 'Y',
      responsable_inspeccion: nombreResponsable,
      chk_externa: 'Y', chk_insectos: 'Y', chk_film: 'Y', 
      chk_humedad: 'Y', chk_interior: 'Y', chk_verificacion: 'Y', chk_insecticida: 'Y'
    });
  }

  verDetalle(record: any) {
    this.isCreating = false;
    this.isEditing = false;
    this.isViewing = true;
    this.selectedRecord = record;
  }

  editar(record: any) { 
    this.isViewing = false; 
    this.isCreating = false; 
    this.isEditing = true; 
    this.selectedRecord = record; 
    this.selectedId = record.id; 
    this.wizardForm.patchValue(record); 
    this.currentStep = 1; 
    this.wizardForm.enable(); 
    this.previews = {};
    this.compressedFiles = {};
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Eliminar registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/calidad/higiene-carga/${id}`).subscribe({
          next: () => {
            this.historial = this.historial.filter(h => h.id !== id);
            if (this.selectedRecord?.id === id) {
              this.selectedRecord = null;
              this.isViewing = false;
              this.isEditing = false;
            }
            Swal.fire('Eliminado', 'Registro eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  ngAfterViewInit() {}

  initCanvas() {
    setTimeout(() => {
      if(this.canvasInspectorRef && this.canvasChoferRef) {
        this.ctxInspector = this.canvasInspectorRef.nativeElement.getContext('2d');
        this.ctxChofer = this.canvasChoferRef.nativeElement.getContext('2d');
        if(this.ctxInspector) { this.ctxInspector.lineWidth = 3; this.ctxInspector.lineCap = 'round'; this.ctxInspector.strokeStyle = '#4338ca'; }
        if(this.ctxChofer) { this.ctxChofer.lineWidth = 3; this.ctxChofer.lineCap = 'round'; this.ctxChofer.strokeStyle = '#334155'; }
      }
    }, 100);
  }

  startDrawing(e: MouseEvent, type: string) {
    this.isDrawing = true;
    const canvas = type === 'inspector' ? this.canvasInspectorRef.nativeElement : this.canvasChoferRef.nativeElement;
    this.draw(e, canvas.getContext('2d'));
  }
  startDrawingTouch(e: TouchEvent, type: string) {
    e.preventDefault();
    this.isDrawing = true;
    const canvas = type === 'inspector' ? this.canvasInspectorRef.nativeElement : this.canvasChoferRef.nativeElement;
    this.drawTouch(e, canvas.getContext('2d'));
  }
  draw(e: MouseEvent, ctx: CanvasRenderingContext2D | null) {
    if (!this.isDrawing || !ctx) return;
    const rect = ctx.canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }
  drawTouch(e: TouchEvent, ctx: CanvasRenderingContext2D | null) {
    if (!this.isDrawing || !ctx) return;
    const rect = ctx.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  }
  stopDrawing() {
    this.isDrawing = false;
    if(this.ctxInspector) this.ctxInspector.beginPath();
    if(this.ctxChofer) this.ctxChofer.beginPath();
  }
  clearCanvas(type: string) {
    const canvas = type === 'inspector' ? this.canvasInspectorRef?.nativeElement : this.canvasChoferRef?.nativeElement;
    const ctx = type === 'inspector' ? this.ctxInspector : this.ctxChofer;
    if(ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
  }

  setCheck(control: string, val: string) {
    this.wizardForm.get(control)?.setValue(val);
    const obsControl = this.wizardForm.get('obs_' + control.split('_')[1]);
    if(val === 'N') {
      obsControl?.setValidators([Validators.required]);
    } else {
      obsControl?.clearValidators();
    }
    obsControl?.updateValueAndValidity();
  }

  nextStep() {
    if(this.currentStep === 1) {
      const step1Controls = ['fecha', 'transporte', 'chofer', 'cliente', 'producto', 'patente', 'habilitacion_transporte', 'dni_chofer', 'cma', 'tipo_envase', 'n_lote'];
      const isValid = step1Controls.every(c => this.wizardForm.get(c)?.valid);
      if(!isValid) { Swal.fire('Atención', 'Complete todos los campos de Cabecera (Fase 1).', 'warning'); return; }
    }
    if(this.currentStep === 2) {
      const step2Controls = this.checkItems.map(i => i.controlName);
      const isValid = step2Controls.every(c => this.wizardForm.get(c)?.valid);
      if(!isValid) { Swal.fire('Atención', 'Debe responder CUMPLE o NO CUMPLE en todos los ítems.', 'warning'); return; }
      
      const isObsValid = step2Controls.every(c => {
         const isNoCumple = this.wizardForm.get(c)?.value === 'N';
         const obsKey = 'obs_' + c.split('_')[1];
         return !isNoCumple || (isNoCumple && this.wizardForm.get(obsKey)?.valid);
      });
      if(!isObsValid) { Swal.fire('Atención', 'Debe completar las observaciones obligatorias.', 'warning'); return; }
    }

    this.currentStep++;
    if(this.currentStep === 3) {
      this.initCanvas();
    }
  }

  prevStep() {
    this.currentStep--;
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compresión fuerte
          this.previews['foto_' + index] = dataUrl;
          
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              this.compressedFiles['foto_' + index] = new File([blob], `foto_${index}_${Date.now()}.jpg`, { type: 'image/jpeg' });
            });
        };
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(index: number) {
    delete this.previews['foto_' + index];
    delete this.compressedFiles['foto_' + index];
    // Evita enviar fotos viejas al editar si se removió y no se añadió nada
    if (this.selectedRecord && this.selectedRecord['foto_' + index]) {
       this.selectedRecord['foto_' + index] = null;
    }
  }

  submitForm() {
    this.isLoading = true;
    
    this.saveDatalists(
      this.wizardForm.value.transporte,
      this.wizardForm.value.cliente,
      this.wizardForm.value.producto
    );

    const formData = new FormData();
    Object.keys(this.wizardForm.value).forEach(key => {
      formData.append(key, this.wizardForm.value[key] || '');
    });

    if(this.canvasInspectorRef && this.ctxInspector && !this.selectedRecord?.firma_inspector) {
      formData.append('firma_inspector', this.canvasInspectorRef.nativeElement.toDataURL('image/png'));
    }
    if(this.canvasChoferRef && this.ctxChofer && !this.selectedRecord?.firma_chofer) {
      formData.append('firma_chofer', this.canvasChoferRef.nativeElement.toDataURL('image/png'));
    }

    // Adjuntar fotos comprimidas
    for (let i = 1; i <= 6; i++) {
      if (this.compressedFiles['foto_' + i]) {
        formData.append('foto_' + i, this.compressedFiles['foto_' + i]);
      } else if (this.isEditing && this.selectedRecord && !this.selectedRecord['foto_' + i] && !this.previews['foto_' + i]) {
        // Enviar indicador para eliminar la foto en backend (si fue borrada de previsualización)
        formData.append('delete_foto_' + i, 'true');
      }
    }

    const request = this.isEditing 
      ? this.http.put(`${environment.apiUrl}/calidad/higiene-carga/${this.selectedId}`, formData)
      : this.http.post(`${environment.apiUrl}/calidad/higiene-carga`, formData);

    request.subscribe({
      next: (res: any) => {
        this.loadHistorial();
        Swal.fire('¡Éxito!', 'Auditoría completada y guardada.', 'success');
        this.isLoading = false;
        this.isCreating = false;
        this.isEditing = false;
        this.isViewing = true;
        this.selectedRecord = res.data || res;
        this.loadHistorial();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', 'Hubo un error al procesar el formulario.', 'error');
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${environment.apiUrl}` + (path.startsWith('/') ? path : '/' + path);
  }

}