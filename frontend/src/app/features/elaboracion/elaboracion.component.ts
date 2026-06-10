import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-elaboracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <header class="mb-2">
        <h2 class="text-2xl font-black text-slate-800">Módulo de Elaboración Maestro</h2>
        <p class="text-slate-500 font-medium">Control de Partes, Rendimientos Matemáticos y Calidad.</p>
      </header>

      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-slate-700">Historial de Partes</h3>
        <button type="button" (click)="$event.preventDefault(); toggleCreate()" class="hidden md:flex px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          {{ isCreatingParte ? 'Cancelar' : 'Nuevo Parte' }}
        </button>
      </div>

      <div class="flex flex-col md:flex-row gap-6 h-auto md:h-[calc(100vh-12rem)]">
        <!-- Panel Izquierdo -->
        <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm" [ngClass]="{'hidden md:flex flex-col': isCreatingParte || isViewingParte, 'flex flex-col': !isCreatingParte && !isViewingParte}">
          <div *ngFor="let p of partes" (click)="verDetalleParte(p)" class="p-4 border-b border-slate-200 hover:bg-white cursor-pointer transition flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 w-full" [class.bg-indigo-50]="selectedParte?.id === p.id">
            <div>
              <p class="font-bold text-slate-800 text-lg">Lote: {{ p.nro_lote || 'N/A' }}</p>
              <p class="text-sm font-medium text-slate-600 mt-1">{{ p.producto_elaborado }}</p>
              <p class="text-base md:text-sm text-slate-400 mt-1">{{ p.fecha | date:'shortDate' }} - Turno: {{ p.horario_turno }}</p>
            </div>
          </div>
          <div *ngIf="partes.length === 0" class="p-6 text-center text-slate-400">
            No hay partes registrados
          </div>
        </div>

        <!-- Panel Derecho -->
        <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-y-auto" [ngClass]="{'hidden md:flex flex-col': !isCreatingParte && !isViewingParte, 'flex flex-col h-full w-full': isCreatingParte || isViewingParte}">
          
          <!-- Botón Volver para Celular -->
          <button *ngIf="isCreatingParte || isViewingParte" (click)="isCreatingParte=false; isViewingParte=false" class="md:hidden m-4 w-[calc(100%-2rem)] bg-slate-100 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center text-lg shadow-sm active:scale-95 transition-all">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            Volver a la Lista
          </button>
          
          <div *ngIf="!isViewingParte && !isCreatingParte" class="h-full hidden md:flex flex-col items-center justify-center text-slate-400">
            <svg class="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <p class="font-medium text-lg">Seleccione un parte para ver detalles.</p>
          </div>

          <form *ngIf="isCreatingParte" [formGroup]="elaboracionForm" class="p-8 space-y-6 pb-24">
            
            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase">Datos Generales</h4>
            <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Fecha</label><input type="date" formControlName="fecha" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Nro Lote</label><input type="text" formControlName="nro_lote" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              
              <div>
                <label class="block text-base md:text-sm font-bold text-slate-500">Producto Elaborado</label>
                <select formControlName="producto_elaborado" (change)="onProductoChange($event)" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base">
                  <option value="" disabled selected>Seleccionar...</option>
                  <option *ngFor="let p of listadoProductos" [value]="p.nombre || p">{{ p.nombre || p }}</option>
                  <option value="NUEVO" class="font-bold text-indigo-600">+ Agregar Nuevo...</option>
                </select>
              </div>
              
              <div>
                <label class="block text-base md:text-sm font-bold text-slate-500">Horario Turno</label>
                <select formControlName="horario_turno" (change)="onTurnoChange($event)" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base">
                  <option value="" disabled selected>Seleccionar...</option>
                  <option *ngFor="let t of listadoTurnos" [value]="t.nombre || t">{{ t.nombre || t }}</option>
                  <option value="NUEVO" class="font-bold text-indigo-600">+ Agregar Nuevo...</option>
                </select>
              </div>

              <div><label class="block text-base md:text-sm font-bold text-slate-500">Variedad</label><input type="text" formControlName="variedad" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% Quebrado Esp.</label><input type="number" formControlName="porcentaje_quebrado_esperado" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div>
                <label class="block text-base md:text-sm font-bold text-slate-500">Envase</label>
                <select formControlName="envase" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 py-4 md:py-3 px-4 bg-white text-lg md:text-base">
                  <option value="" disabled selected>Seleccione Envase...</option>
                  <option value="Big Bag">Big Bag</option>
                  <option value="Bolsa">Bolsa</option>
                </select>
              </div>
              <div>
                <label class="block text-base md:text-sm font-bold text-slate-500">Grado</label>
                <select formControlName="grado" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 py-4 md:py-3 px-4 bg-white text-lg md:text-base">
                  <option value="" disabled selected>Seleccione Grado...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Silo Origen</label><input type="text" formControlName="silo_origen" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Balanza MP Total Kilos</label><input type="number" formControlName="balanza_mp_total_kilos" class="w-full border-indigo-300 bg-indigo-50 font-bold rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Productor Origen</label><input type="text" formControlName="productor_lote_origen" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Agregados</h4>
            <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
              <div><label class="block text-base md:text-sm font-bold text-slate-500">(Agregados) 1/2 Grano KG</label><input type="number" formControlName="agregados_1_2_grano_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Arroz Elaborado KG</label><input type="number" formControlName="agregados_arroz_elaborado_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Terminados y Subproductos</h4>
            <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Medio Grano KG</label><input type="number" formControlName="terminado_1_2_grano_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Arrocín KG</label><input type="number" formControlName="terminado_arrocin_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Afrechillo KG</label><input type="number" formControlName="terminado_afrechillo_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Descarte Selectora KG</label><input type="number" formControlName="terminado_descarte_selectora_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Producto Terminado KG</label><input type="number" formControlName="producto_terminado_kg" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">(Terminado) Cáscara KG</label><input type="number" formControlName="terminado_cascara_kg" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Calidad</h4>
            <div class="flex justify-end mb-2">
              <button type="button" (click)="$event.preventDefault(); addControlCalidad()" class="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 text-base md:text-sm">Añadir Control</button>
            </div>
            <div formArrayName="controles" class="space-y-3">
              <div *ngFor="let ctrl of controles.controls; let i = index" [formGroupName]="i" class="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div class="w-32"><label class="block text-base md:text-sm font-bold text-slate-500">Hora</label><input type="time" formControlName="hora" class="w-full border-slate-200 rounded shadow-sm text-sm p-2"></div>
                <div class="flex-1"><label class="block text-base md:text-sm font-bold text-slate-500">% Ent</label><input type="number" formControlName="porcentaje_ent" class="w-full border-slate-200 rounded shadow-sm text-sm p-2"></div>
                <div class="flex-1"><label class="block text-base md:text-sm font-bold text-slate-500">% Queb</label><input type="number" formControlName="porcentaje_queb" class="w-full border-slate-200 rounded shadow-sm text-sm p-2"></div>
                <div class="flex-1"><label class="block text-base md:text-sm font-bold text-slate-500">Molinero</label><input type="text" formControlName="molinero" class="w-full border-slate-200 rounded shadow-sm text-sm p-2"></div>
                <button type="button" (click)="removeControlCalidad(i)" class="text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded self-end mb-1">X</button>
              </div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Control Molino</h4>
            <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">% Rendimiento</label><input type="number" formControlName="molino_rendimiento" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% Quebrado</label><input type="number" formControlName="molino_quebrado" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">% Enteros</label><input type="number" formControlName="molino_enteros" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">% Ent. Puros</label><input type="number" formControlName="molino_ent_puros" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Prod Term Descarte</label><input type="number" formControlName="molino_prod_term_descarte" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Control Molinillo</h4>
            <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% Rendimiento</label><input type="number" formControlName="molinillo_rendimiento" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">% Quebrado</label><input type="number" formControlName="molinillo_quebrado" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% Enteros</label><input type="number" formControlName="molinillo_enteros" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% ME</label><input type="number" formControlName="molinillo_me" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-slate-500">% Yeso</label><input type="number" formControlName="molinillo_yeso" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></div>
              <div><label class="block text-base md:text-sm font-bold text-indigo-500">Prod Term Esperado</label><input type="number" formControlName="producto_terminado_esperado" readonly class="w-full bg-slate-200 border-none font-bold text-indigo-700 rounded-xl p-4 md:p-3 text-lg md:text-base cursor-not-allowed"></div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Inspección</h4>
            <div class="grid grid-cols-3 gap-4 bg-slate-50 p-4 border rounded">
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="insp_bolsa" class="rounded text-indigo-600"> <span>Insp Bolsa</span></label>
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="insp_big_bag" class="rounded text-indigo-600"> <span>Insp Big Bag</span></label>
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="imanes_pulidora" class="rounded text-indigo-600"> <span>Imanes Pulidora</span></label>
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="imanes_envasado" class="rounded text-indigo-600"> <span>Imanes Envasado</span></label>
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="zarandas_inicio" class="rounded text-indigo-600"> <span>Zarandas Inicio</span></label>
              <label class="flex items-center space-x-2 text-sm font-bold text-slate-700"><input type="checkbox" formControlName="zarandas_fin" class="rounded text-indigo-600"> <span>Zarandas Fin</span></label>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Paradas</h4>
            <div class="flex justify-end mb-2">
              <button type="button" (click)="$event.preventDefault(); addParada()" class="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 text-base md:text-sm">Añadir Parada</button>
            </div>
            <div formArrayName="paradas" class="space-y-3">
              <div *ngFor="let parada of paradas.controls; let i = index" [formGroupName]="i" class="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div class="flex-1">
                  <input type="text" formControlName="motivo" placeholder="Motivo" class="w-full border-slate-200 rounded shadow-sm text-sm p-2">
                </div>
                <div class="w-32">
                  <input type="time" formControlName="hr_parada" class="w-full border-slate-200 rounded shadow-sm text-sm p-2">
                </div>
                <div class="w-32">
                  <input type="time" formControlName="hr_arranque" class="w-full border-slate-200 rounded shadow-sm text-sm p-2">
                </div>
                <button type="button" (click)="removeParada(i)" class="text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded">X</button>
              </div>
            </div>

            <h4 class="font-bold text-slate-700 bg-slate-100 p-2 rounded uppercase mt-8">Otros</h4>
            <div class="grid grid-cols-1 gap-4">
              <div><label class="block text-base md:text-sm font-bold text-slate-500">Observaciones</label><textarea formControlName="observaciones" rows="3" class="w-full border-slate-200 rounded-xl p-4 md:p-3 text-lg md:text-base"></textarea></div>
            </div>
            
            <div class="fixed bottom-0 right-0 w-2/3 p-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-end">
              <button type="button" (click)="submitForm()" [disabled]="isLoading" class="px-8 py-3 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50">
                {{ isLoading ? 'Guardando...' : 'Guardar Parte Maestro' }}
              </button>
            </div>
          </form>

          <div *ngIf="isViewingParte && selectedParte" class="p-8 space-y-6">
            <h4 class="text-2xl font-black text-slate-800 border-b pb-4">Modo Lectura: Lote {{ selectedParte.nro_lote }}</h4>
            
            <!-- DATOS GENERALES -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Datos Generales</h5>
              <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Fecha</p><p class="font-medium">{{ selectedParte.fecha | date:'shortDate' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Nro Lote</p><p class="font-medium">{{ selectedParte.nro_lote }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Producto</p><p class="font-medium text-indigo-700">{{ selectedParte.producto_elaborado }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Turno</p><p class="font-medium">{{ selectedParte.horario_turno }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Variedad</p><p class="font-medium">{{ selectedParte.variedad || '-' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">% Quebrado Esp.</p><p class="font-medium">{{ selectedParte.porcentaje_quebrado_esperado }}%</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Envase</p><p class="font-medium">{{ selectedParte.envase || '-' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Grado</p><p class="font-medium">{{ selectedParte.grado || '-' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Silo</p><p class="font-medium">{{ selectedParte.silo_origen || '-' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Balanza MP</p><p class="font-black text-indigo-800">{{ selectedParte.balanza_mp_total_kilos | number:'1.2-2' }} KG</p></div>
                <div class="col-span-2"><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Productor Origen</p><p class="font-medium">{{ selectedParte.productor_lote_origen || '-' }}</p></div>
              </div>
            </div>

            <!-- AGREGADOS -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Agregados</h5>
              <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Medio Grano</p><p class="font-medium">{{ selectedParte.agregados_1_2_grano_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Arroz Elaborado</p><p class="font-medium">{{ selectedParte.agregados_arroz_elaborado_kg | number:'1.2-2' }} KG</p></div>
              </div>
            </div>

            <!-- TERMINADOS Y SUBPRODUCTOS -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Terminados y Subproductos</h5>
              <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">1/2 Grano</p><p class="font-medium">{{ selectedParte.terminado_1_2_grano_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Arrocín</p><p class="font-medium">{{ selectedParte.terminado_arrocin_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Afrechillo</p><p class="font-medium">{{ selectedParte.terminado_afrechillo_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Descarte</p><p class="font-medium">{{ selectedParte.terminado_descarte_selectora_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Producto Terminado</p><p class="font-black text-green-700">{{ selectedParte.producto_terminado_kg | number:'1.2-2' }} KG</p></div>
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Cáscara</p><p class="font-black text-indigo-700">{{ selectedParte.terminado_cascara_kg | number:'1.2-2' }} KG</p></div>
              </div>
            </div>

            <!-- CONTROL MOLINO -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Control Molino</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Rendimiento</p><p class="font-black text-indigo-700">{{ selectedParte.molino_rendimiento | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Quebrado</p><p class="font-medium">{{ selectedParte.molino_quebrado | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Enteros</p><p class="font-black text-indigo-700">{{ selectedParte.molino_enteros | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Ent. Puros</p><p class="font-black text-indigo-700">{{ selectedParte.molino_ent_puros | number:'1.2-2' }}</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Prod Term + Desc</p><p class="font-medium">{{ selectedParte.molino_prod_term_descarte | number:'1.2-2' }}</p></div>
              </div>
            </div>

            <!-- CONTROL MOLINILLO -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Control Molinillo</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Rendimiento</p><p class="font-medium">{{ selectedParte.molinillo_rendimiento | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Quebrado</p><p class="font-black text-indigo-700">{{ selectedParte.molinillo_quebrado | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Enteros</p><p class="font-medium">{{ selectedParte.molinillo_enteros | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">M/E</p><p class="font-medium">{{ selectedParte.molinillo_me | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-slate-500 font-bold uppercase">Yeso</p><p class="font-medium">{{ selectedParte.molinillo_yeso | number:'1.2-2' }}%</p></div>
                <div><p class="text-base md:text-sm text-indigo-500 font-bold uppercase">Prod. Esp.</p><p class="font-black text-indigo-700">{{ selectedParte.producto_terminado_esperado | number:'1.2-2' }} KG</p></div>
              </div>
            </div>

            <!-- INSPECCIÓN Y OBSERVACIONES -->
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
              <h5 class="font-bold text-slate-700 uppercase mb-4">Inspección y Observaciones</h5>
              <div class="flex flex-wrap gap-3 mb-6">
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.insp_bolsa ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Bolsa: {{ selectedParte.insp_bolsa ? 'Sí' : 'No' }}</span>
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.insp_big_bag ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Big Bag: {{ selectedParte.insp_big_bag ? 'Sí' : 'No' }}</span>
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.imanes_pulidora ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Imán Pul.: {{ selectedParte.imanes_pulidora ? 'Sí' : 'No' }}</span>
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.imanes_envasado ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Imán Env.: {{ selectedParte.imanes_envasado ? 'Sí' : 'No' }}</span>
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.zarandas_inicio ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Zaranda In.: {{ selectedParte.zarandas_inicio ? 'Sí' : 'No' }}</span>
                <span class="px-3 py-1 text-base md:text-sm font-bold rounded-full" [ngClass]="selectedParte.zarandas_fin ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'">Zaranda Fin: {{ selectedParte.zarandas_fin ? 'Sí' : 'No' }}</span>
              </div>
              <div class="bg-white p-4 rounded border border-slate-200">
                <p class="text-base md:text-sm text-slate-500 font-bold uppercase mb-1">Observaciones</p>
                <p class="text-sm text-slate-700">{{ selectedParte.observaciones || 'Ninguna observación registrada.' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- BOTÓN FLOTANTE FAB (Solo en móvil, cuando se ve la lista) -->
      <button *ngIf="!isCreatingParte && !isViewingParte" 
              (click)="isCreatingParte=true" 
              class="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-black z-50 hover:bg-indigo-700 active:scale-95 transition-transform">
        +
      </button>

      <!-- BOTÓN FLOTANTE FAB ELABORACION -->
      <button *ngIf="!isCreatingParte && !isViewingParte" 
              (click)="toggleCreate()" 
              class="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-black z-50 hover:bg-indigo-700 active:scale-95 transition-transform border-4 border-white">
        +
      </button>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ElaboracionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  partes: any[] = [];
  listadoProductos: any[] = [];
  listadoTurnos: any[] = [];
  
  isLoading = false;
  isViewingParte = false;
  isCreatingParte = false;
  selectedParte: any = null;

  elaboracionForm: FormGroup;

  constructor() {
    this.elaboracionForm = this.fb.group({
      fecha: [''],
      nro_lote: [''],
      producto_elaborado: [''],
      horario_turno: [''],
      variedad: [''],
      porcentaje_quebrado_esperado: [0],
      envase: [''],
      grado: [''],
      silo_origen: [''],
      balanza_mp_total_kilos: [0],
      productor_lote_origen: [''],

      agregados_1_2_grano_kg: [0],
      agregados_arroz_elaborado_kg: [0],

      terminado_1_2_grano_kg: [0],
      terminado_arrocin_kg: [0],
      terminado_afrechillo_kg: [0],
      terminado_descarte_selectora_kg: [0],
      terminado_cascara_kg: [0],
      producto_terminado_kg: [0],

      molino_rendimiento: [0],
      molino_quebrado: [0],
      molino_enteros: [0],
      molino_ent_puros: [0],
      molino_prod_term_descarte: [0],

      molinillo_rendimiento: [0],
      molinillo_quebrado: [0],
      molinillo_enteros: [0],
      molinillo_me: [0],
      molinillo_yeso: [0],
      producto_terminado_esperado: [0],

      insp_bolsa: [false],
      insp_big_bag: [false],
      imanes_pulidora: [false],
      imanes_envasado: [false],
      zarandas_inicio: [false],
      zarandas_fin: [false],

      observaciones: [''],
      firma_inicio: [''],
      firma_cierre: [''],
      operario_nombre: [''],
      paradas: this.fb.array([]),
      controles: this.fb.array([])
    });
  }

  get paradas() { return this.elaboracionForm.get('paradas') as FormArray; }
  get controles() { return this.elaboracionForm.get('controles') as FormArray; }

  addParada() { this.paradas.push(this.fb.group({ motivo: [''], hr_parada: [''], hr_arranque: [''] })); }
  removeParada(index: number) { this.paradas.removeAt(index); }

  addControlCalidad() { this.controles.push(this.fb.group({ hora: [''], porcentaje_ent: [0], porcentaje_queb: [0], molinero: [''] })); }
  removeControlCalidad(index: number) { this.controles.removeAt(index); }

  ngOnInit() {
    this.loadPartes();
    this.loadSelects();
    
    const user = this.authService.currentUser();
    if(user) {
      this.elaboracionForm.patchValue({ operario_nombre: user.username || user.email }, { emitEvent: false });
    }

    this.elaboracionForm.valueChanges.subscribe(val => {
      const getNum = (v: any) => parseFloat(v) || 0;
      
      const balanza = getNum(val.balanza_mp_total_kilos);
      const prod_term_kg = getNum(val.producto_terminado_kg);
      const term_mg = getNum(val.terminado_1_2_grano_kg);
      const term_arrocin = getNum(val.terminado_arrocin_kg);
      const term_afrechillo = getNum(val.terminado_afrechillo_kg);
      const term_desc = getNum(val.terminado_descarte_selectora_kg);
      const molino_quebrado = getNum(val.molino_quebrado);
      const molinillo_rendimiento = getNum(val.molinillo_rendimiento);
      const molinillo_enteros = getNum(val.molinillo_enteros);

      let calc_cascara = balanza - (prod_term_kg + term_mg + term_arrocin + term_afrechillo + term_desc);
      let calc_molino_rend = balanza > 0 ? ((prod_term_kg + term_arrocin + term_mg + term_desc) / balanza) * 100 : 0;
      let calc_molino_ent_puros = (prod_term_kg + term_desc) * (1 - (molino_quebrado / 100));
      let calc_molino_enteros = balanza > 0 ? (calc_molino_ent_puros / balanza) * 100 : 0;
      let calc_molinillo_quebrado = molinillo_rendimiento - molinillo_enteros;
      let calc_prod_term_esp = (1 - (calc_molinillo_quebrado / 100)) > 0 ? (balanza * (molinillo_enteros / 100)) / (1 - (calc_molinillo_quebrado / 100)) : 0;

      this.elaboracionForm.patchValue({
        terminado_cascara_kg: calc_cascara.toFixed(2),
        molino_rendimiento: calc_molino_rend.toFixed(2),
        molino_ent_puros: calc_molino_ent_puros.toFixed(2),
        molino_enteros: calc_molino_enteros.toFixed(2),
        molinillo_quebrado: calc_molinillo_quebrado.toFixed(2),
        producto_terminado_esperado: calc_prod_term_esp.toFixed(2)
      }, { emitEvent: false });
    });
  }

  loadPartes() {
    this.http.get<any[]>(`${environment.apiUrl}/produccion/partes`).subscribe({
      next: (data) => this.partes = data,
      error: (err) => console.error(err)
    });
  }

  loadSelects() {
    this.http.get<any>(`${environment.apiUrl}/produccion/productos`).subscribe(res => this.listadoProductos = res.data ? res.data : res);
    this.http.get<any>(`${environment.apiUrl}/produccion/turnos`).subscribe(res => this.listadoTurnos = res.data ? res.data : res);
  }

  async onProductoChange(event: any) {
    if (event.target.value === 'NUEVO') {
      const { value: nuevo } = await Swal.fire({
        title: 'Nuevo Producto Elaborado',
        input: 'text',
        inputPlaceholder: 'Ingrese nombre',
        showCancelButton: true
      });
      if (nuevo) {
        const formData = new FormData();
        formData.append('nombre_carga', nuevo);

        this.http.post(`${environment.apiUrl}/logistica/productos_carga`, formData).subscribe({
          next: (res: any) => {
            this.listadoProductos.push({ nombre: nuevo, nombre_carga: nuevo });
            this.elaboracionForm.get('producto_elaborado')?.setValue(nuevo);
            Swal.fire('Guardado', 'Producto agregado con éxito', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
            this.elaboracionForm.patchValue({ producto_elaborado: '' });
          }
        });
      } else {
        this.elaboracionForm.patchValue({ producto_elaborado: '' });
      }
    }
  }

  async onTurnoChange(event: any) {
    if (event.target.value === 'NUEVO') {
      const { value: nuevo } = await Swal.fire({
        title: 'Nuevo Horario de Turno',
        input: 'text',
        inputPlaceholder: 'Ingrese turno',
        showCancelButton: true
      });
      if (nuevo) {
        this.http.post(`${environment.apiUrl}/produccion/turnos`, { nombre: nuevo }).subscribe((res: any) => {
          this.listadoTurnos.push({ nombre: nuevo });
          this.elaboracionForm.get('horario_turno')?.setValue(nuevo);
        });
      } else {
        this.elaboracionForm.patchValue({ horario_turno: '' });
      }
    }
  }

  toggleCreate() {
    this.isCreatingParte = !this.isCreatingParte;
    this.isViewingParte = false;
    this.selectedParte = null;
    if(this.isCreatingParte) this.elaboracionForm.reset();
  }

  verDetalleParte(p: any) {
    this.isViewingParte = true;
    this.isCreatingParte = false;
    this.selectedParte = p;
  }

  verJSON(p: any) {
    let html = '<div class="text-left text-base md:text-sm font-mono bg-slate-100 p-4 rounded overflow-auto h-96">' + JSON.stringify(p, null, 2) + '</div>';
    Swal.fire({
      title: "RAW Data",
      html: html,
      width: "800px",
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  submitForm() {
    this.isLoading = true;
    const payload = { ...this.elaboracionForm.getRawValue() };
    if (payload.producto_elaborado) {
      payload.nombre_carga = payload.producto_elaborado;
    }
    
    this.http.post(`${environment.apiUrl}/produccion/partes`, payload).subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Parte guardado.', 'success');
        this.isLoading = false;
        this.toggleCreate();
        this.loadPartes();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar.', 'error');
        this.isLoading = false;
      }
    });
  }
}
