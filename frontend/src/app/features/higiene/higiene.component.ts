import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-higiene',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] flex gap-6">
      <!-- Izquierda: Lista de Historial -->
      <div class="w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-slate-800">Control Higiene</h2>
            <p class="text-sm text-slate-500 font-medium">Registros PCC</p>
          </div>
          <button type="button" (click)="$event.preventDefault(); crearNuevo()" class="px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
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
              <span class="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">PCC</span>
              <span class="text-xs text-slate-400 font-bold">{{ h.fecha }}</span>
            </div>
            <p class="font-bold text-slate-700">Transporte: {{ h.transporte }}</p>
            <p class="text-sm text-slate-500">Patente: {{ h.patente }}</p>
            <div class="flex justify-end items-center mt-2 pt-2 border-t border-slate-100">
              <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); editar(h)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition mr-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); delete(h.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
          <p *ngIf="historial.length === 0" class="text-center text-slate-400 py-4 text-sm">No hay controles de higiene registrados.</p>
        </div>
      </div>

      <!-- Derecha: Visualización / Wizard -->
      <div class="w-2/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
        
        <!-- Estado Vacío -->
        <div *ngIf="!isCreating && !isViewing && !isEditing" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10">
          <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-xl font-bold text-slate-600">Ningún Registro Seleccionado</h3>
          <p class="text-slate-500 mt-1">Seleccione un control PCC del historial o cree uno nuevo.</p>
        </div>

        <!-- Módulo de Lectura (isViewing) -->
        <div *ngIf="isViewing && selectedRecord" class="p-8 space-y-6 fade-in h-full overflow-y-auto">
          <div class="flex justify-between items-center border-b pb-4">
            <h3 class="text-2xl font-bold text-slate-800">Reporte PCC #{{ selectedRecord.id }}</h3>
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">{{ selectedRecord.fecha }}</span>
          </div>

          <!-- A. Cabecera -->
          <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 grid grid-cols-2 gap-4">
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Transporte / Patente</span> <span class="font-bold text-slate-700">{{ selectedRecord.transporte }} ({{ selectedRecord.patente }})</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Habilitación Transporte</span> <span class="font-bold text-slate-700">{{ selectedRecord.habilitacion_transporte === 'Y' ? 'SÍ' : 'NO' }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Chofer / DNI</span> <span class="font-bold text-slate-700">{{ selectedRecord.chofer }} (DNI: {{ selectedRecord.dni_chofer || 'S/D' }})</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">C.M.A.</span> <span class="font-bold text-slate-700">{{ selectedRecord.cma === 'Y' ? 'SÍ' : 'NO' }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Cliente</span> <span class="font-bold text-slate-700">{{ selectedRecord.cliente }}</span></div>
            <div><span class="text-xs font-bold text-slate-400 block uppercase">Producto / Lote</span> <span class="font-bold text-slate-700">{{ selectedRecord.producto }} (Lote: {{ selectedRecord.n_lote || 'S/D' }})</span></div>
            <div class="col-span-2"><span class="text-xs font-bold text-slate-400 block uppercase">Tipo Envase</span> <span class="font-bold text-slate-700">{{ selectedRecord.tipo_envase || 'S/D' }}</span></div>
          </div>

          <!-- B. Checklist de Higiene -->
          <h4 class="text-lg font-bold text-slate-800 mt-6 mb-2">Checklist de Higiene y Observaciones</h4>
          <div class="space-y-3">
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Higiene Externa (Sin polvo/manchas)', val: selectedRecord.chk_externa, obs: selectedRecord.obs_externa }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Libre de Insectos en Exterior', val: selectedRecord.chk_insectos, obs: selectedRecord.obs_insectos }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Film de Polietileno (Debajo y Arriba)', val: selectedRecord.chk_film, obs: selectedRecord.obs_film }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Mercadería Seca (Sin humedad)', val: selectedRecord.chk_humedad, obs: selectedRecord.obs_humedad }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Transporte Limpio y Seco (Interior)', val: selectedRecord.chk_interior, obs: selectedRecord.obs_interior }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Transportista verificó bolsas durante carga', val: selectedRecord.chk_verificacion, obs: selectedRecord.obs_verificacion }"></ng-container>
            <ng-container *ngTemplateOutlet="checkItem; context: { title: 'Aplicación de Insecticida Exterior', val: selectedRecord.chk_insecticida, obs: selectedRecord.obs_insecticida }"></ng-container>
          </div>

          <ng-template #checkItem let-title="title" let-val="val" let-obs="obs">
            <div class="p-4 border rounded-xl shadow-sm" [ngClass]="{'bg-red-50 border-red-200': val === 'N', 'bg-green-50 border-green-200': val === 'Y', 'bg-slate-50 border-slate-200': !val || (val !== 'Y' && val !== 'N')}">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-700">{{ title }}</span>
                <span class="font-black px-3 py-1 rounded text-sm" [ngClass]="{'bg-red-200 text-red-800': val === 'N', 'bg-green-200 text-green-800': val === 'Y'}">
                  {{ val === 'Y' ? 'SÍ CUMPLE' : (val === 'N' ? 'NO CUMPLE' : 'S/D') }}
                </span>
              </div>
              <div *ngIf="obs" class="mt-3 text-sm text-slate-600 italic border-t border-slate-200/50 pt-2">
                <span class="font-bold text-slate-500 not-italic">Observación:</span> {{ obs }}
              </div>
            </div>
          </ng-template>

          <!-- Firmas en la vista Detalles -->
          <h3 class="font-bold text-lg text-slate-700 mt-6 mb-3">Firmas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-6 grid grid-cols-2 gap-4">
            <div><span class="text-xs font-bold text-indigo-400 block uppercase">Estado del Clima</span> <span class="font-bold text-indigo-900">{{ selectedRecord.estado_clima || 'S/D' }}</span></div>
            <div><span class="text-xs font-bold text-indigo-400 block uppercase">Responsable Inspección</span> <span class="font-bold text-indigo-900">{{ selectedRecord.responsable_inspeccion || 'S/D' }}</span></div>
            <div class="col-span-2"><span class="text-xs font-bold text-indigo-400 block uppercase">Observaciones Generales</span> <span class="text-indigo-900">{{ selectedRecord.observaciones_generales || 'Ninguna' }}</span></div>
          </div>
          
          <div class="flex justify-end mt-6 pt-4 border-t border-slate-100">
             <button type="button" (click)="selectedRecord = null; isViewing = false" class="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Cerrar Detalles</button>
          </div>
        </div>

        <!-- Módulo Wizard de Creación/Edición -->
        <div *ngIf="isCreating || isEditing" class="flex-1 overflow-y-auto p-8 fade-in">
          <!-- Stepper Visual -->
          <div class="flex items-center mb-8 relative">
            <div class="absolute inset-0 flex items-center justify-center z-0">
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
              <h3 class="text-xl font-bold text-slate-700 border-b pb-2">Fase 1: Datos Generales</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Fecha</label>
                  <input type="date" formControlName="fecha" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Transporte / Empresa</label>
                  <input type="text" formControlName="transporte" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Patente Vehículo</label>
                  <input type="text" formControlName="patente" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Habilitación Transporte</label>
                  <select formControlName="habilitacion_transporte" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Y">Sí (Y)</option>
                    <option value="N">No (N)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Chofer</label>
                  <input type="text" formControlName="chofer" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">DNI Chofer</label>
                  <input type="text" formControlName="dni_chofer" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">C.M.A.</label>
                  <select formControlName="cma" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Y">Sí (Y)</option>
                    <option value="N">No (N)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Cliente / Destino</label>
                  <input type="text" formControlName="cliente" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Producto</label>
                  <input type="text" formControlName="producto" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Tipo Envase</label>
                  <select formControlName="tipo_envase" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Seleccione...</option>
                    <option value="BIG BAG">BIG BAG</option>
                    <option value="BOLSA">BOLSA</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">N° Lote</label>
                  <input type="text" formControlName="n_lote" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
              </div>
              
              <div class="flex justify-end mt-8 pt-4 border-t border-slate-100">
                <button type="button" (click)="$event.preventDefault(); nextStep()" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Siguiente</button>
              </div>
            </div>

            <!-- PASO 2: Checklist -->
            <div *ngIf="currentStep === 2" class="space-y-6 fade-in">
              <h3 class="text-xl font-bold text-slate-700 border-b pb-2">Fase 2: Checklist de Higiene</h3>
              
              <div class="space-y-6">
                <div *ngFor="let item of checkItems" class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <span class="text-lg font-black text-slate-700">{{ item.label }}</span>
                    <div class="flex mt-3 md:mt-0 w-full md:w-48">
                      <select [formControlName]="item.controlName" (change)="setCheck(item.controlName, wizardForm.get(item.controlName)?.value)" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-gray-800" [ngClass]="{'text-green-700': wizardForm.get(item.controlName)?.value === 'Y', 'text-red-700': wizardForm.get(item.controlName)?.value === 'N'}">
                        <option value="Y" class="text-green-700">Sí (Cumple)</option>
                        <option value="N" class="text-red-700">No (No Cumple)</option>
                      </select>
                    </div>
                  </div>
                  <!-- Observaciones Libres -->
                  <div class="mt-4 fade-in">
                    <textarea [formControlName]="item.obsName" rows="2" placeholder="Observaciones (Opcional si Cumple, Obligatorio si No Cumple)..." class="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3 text-sm"></textarea>
                  </div>
                </div>
              </div>

              <div class="flex justify-between mt-8 pt-4 border-t border-slate-100">
                <button type="button" (click)="$event.preventDefault(); prevStep()" class="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Volver</button>
                <button type="button" (click)="$event.preventDefault(); nextStep()" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Siguiente</button>
              </div>
            </div>

            <!-- PASO 3: Cierre y Firmas -->
            <div *ngIf="currentStep === 3" class="space-y-6 fade-in">
              <h3 class="text-xl font-bold text-slate-700 border-b pb-2">Fase 3: Cierre y Firmas</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Estado del Clima</label>
                  <input type="text" formControlName="estado_clima" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">Responsable de Inspección</label>
                  <input type="text" formControlName="responsable_inspeccion" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500">
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-bold text-slate-700 mb-1">Observaciones Generales</label>
                  <textarea formControlName="observaciones_generales" rows="3" class="w-full border-slate-200 rounded-lg shadow-sm py-2.5 px-3 bg-slate-50 focus:ring-indigo-500"></textarea>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <!-- Firma Inspector -->
                <div class="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <label class="block text-sm font-bold text-indigo-700 mb-2 flex justify-between">
                    <span>Firma Inspector Calidad</span>
                    <button type="button" (click)="clearCanvas('inspector')" class="text-xs text-slate-500 hover:text-red-500 underline">Borrar</button>
                  </label>
                  <canvas *ngIf="!selectedRecord?.firma_inspector" #canvasInspector width="300" height="150" class="bg-white border-2 border-dashed border-indigo-200 w-full rounded cursor-crosshair touch-none"
                    (mousedown)="startDrawing($event, 'inspector')" (mousemove)="draw($event, ctxInspector)" (mouseup)="stopDrawing()" (mouseleave)="stopDrawing()"
                    (touchstart)="startDrawingTouch($event, 'inspector')" (touchmove)="drawTouch($event, ctxInspector)" (touchend)="stopDrawing()"></canvas>
                  <img *ngIf="selectedRecord?.firma_inspector" [src]="selectedRecord.firma_inspector" class="bg-white border-2 border-dashed border-indigo-200 w-full rounded max-h-[150px] object-contain">
                </div>

                <!-- Firma Chofer -->
                <div class="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <label class="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Firma Chofer Transporte</span>
                    <button type="button" (click)="clearCanvas('chofer')" class="text-xs text-slate-500 hover:text-red-500 underline">Borrar</button>
                  </label>
                  <canvas *ngIf="!selectedRecord?.firma_chofer" #canvasChofer width="300" height="150" class="bg-white border-2 border-dashed border-slate-300 w-full rounded cursor-crosshair touch-none"
                    (mousedown)="startDrawing($event, 'chofer')" (mousemove)="draw($event, ctxChofer)" (mouseup)="stopDrawing()" (mouseleave)="stopDrawing()"
                    (touchstart)="startDrawingTouch($event, 'chofer')" (touchmove)="drawTouch($event, ctxChofer)" (touchend)="stopDrawing()"></canvas>
                  <img *ngIf="selectedRecord?.firma_chofer" [src]="selectedRecord.firma_chofer" class="bg-white border-2 border-dashed border-slate-300 w-full rounded max-h-[150px] object-contain">
                </div>
              </div>

              <div class="flex justify-between mt-8 pt-4 border-t border-slate-100">
                <button type="button" (click)="$event.preventDefault(); prevStep()" class="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Volver</button>
                <button type="button" (click)="submitForm()" [disabled]="isLoading" class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition disabled:opacity-50">
                  {{ isLoading ? 'Procesando...' : 'Guardar PCC' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HigieneComponent implements AfterViewInit {
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

  wizardForm: FormGroup;

  checkItems = [
    { label: 'Higiene Externa (Sin polvo/manchas)', controlName: 'chk_externa', obsName: 'obs_externa' },
    { label: 'Libre de Insectos en Exterior', controlName: 'chk_insectos', obsName: 'obs_insectos' },
    { label: 'Film de Polietileno (Debajo y Arriba)', controlName: 'chk_film', obsName: 'obs_film' },
    { label: 'Mercadería Seca (Sin humedad)', controlName: 'chk_humedad', obsName: 'obs_humedad' },
    { label: 'Transporte Limpio y Seco (Interior)', controlName: 'chk_interior', obsName: 'obs_interior' },
    { label: 'Transportista verificó bolsas durante carga', controlName: 'chk_verificacion', obsName: 'obs_verificacion' },
    { label: 'Aplicación de Insecticida Exterior', controlName: 'chk_insecticida', obsName: 'obs_insecticida' }
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
  }

  loadHistorial() {
    this.historial = [];
    this.http.get<any[]>(`${environment.apiUrl}/api/calidad/higiene-carga`).subscribe({
      next: (res) => {
        if (res && res.length > 0) this.historial = res;
      },
      error: (err) => console.error('Error cargando historial de higiene', err)
    });
  }

  crearNuevo() {
    this.isCreating = true;
    this.isViewing = false;
    this.isEditing = false;
    this.selectedId = null;
    this.selectedRecord = null;
    this.currentStep = 1;
    this.wizardForm.reset();
    
    // Set default values for Y/N
    this.wizardForm.patchValue({
      habilitacion_transporte: 'Y',
      cma: 'Y',
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
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Eliminar registro PCC?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/api/calidad/higiene-carga/${id}`).subscribe({
          next: () => {
            this.historial = this.historial.filter(h => h.id !== id);
            if (this.selectedRecord?.id === id) {
              this.selectedRecord = null;
              this.isViewing = false;
              this.isEditing = false;
            }
            Swal.fire('Eliminado', 'Registro PCC eliminado.', 'success');
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

  submitForm() {
    this.isLoading = true;
    const payload = { ...this.wizardForm.value };

    if(this.canvasInspectorRef && this.ctxInspector) {
      payload.firma_inspector = this.canvasInspectorRef.nativeElement.toDataURL('image/png');
    }
    if(this.canvasChoferRef && this.ctxChofer) {
      payload.firma_chofer = this.canvasChoferRef.nativeElement.toDataURL('image/png');
    }

    const request = this.isEditing 
      ? this.http.put(`${environment.apiUrl}/api/calidad/higiene-carga/${this.selectedId}`, payload)
      : this.http.post(`${environment.apiUrl}/api/calidad/higiene-carga`, payload);

    request.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        Swal.fire('¡Éxito!', 'Auditoría PCC completada y guardada.', 'success');
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