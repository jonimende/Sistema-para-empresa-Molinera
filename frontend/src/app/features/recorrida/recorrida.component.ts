import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recorrida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] flex gap-6">
      <!-- Izquierda: Lista de Recorridas -->
      <div class="w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-slate-800">Historial de Auditorías</h2>
            <p class="text-sm text-slate-500 font-medium">Recorridas Registradas</p>
          </div>
          <button type="button" (click)="$event.preventDefault(); crearNuevo()"  class="px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nueva Recorrida
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Iterar Lista Real -->
          <div *ngFor="let rec of recorridas" 
               (click)="verDetalle(rec)"
               [class.border-indigo-500]="selectedRecord?.id === rec.id"
               [class.bg-indigo-50]="selectedRecord?.id === rec.id"
               class="p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 cursor-pointer transition">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">RDP</span>
              <span class="text-xs text-slate-400 font-bold">{{ rec.fecha | date:'dd/MM/yyyy' }}</span>
            </div>
            <p class="font-bold text-slate-700">Inspector: {{ rec.responsable_nombre || rec.inspector }}</p>
            <div class="flex justify-end items-center mt-2 pt-2 border-t border-slate-100">
              <div class="flex space-x-2">
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); editar(rec)"  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); eliminar(rec.id)"  class="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="recorridas.length === 0" class="text-center text-slate-400 py-4 text-sm">No hay recorridas registradas.</p>
        </div>
      </div>

      <!-- Derecha: Detalle / Formulario Nuevo -->
      <div class="w-2/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
        
        <!-- Estado Vacío -->
        <div *ngIf="!isCreating && !isEditing && !isViewing" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10">
          <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-xl font-bold text-slate-600">Ningún Registro Seleccionado</h3>
          <p class="text-slate-500 mt-1">Seleccione una recorrida del historial o cree una nueva.</p>
        </div>

        <!-- Módulo de Lectura -->
        <div *ngIf="isViewing && selectedRecord" class="flex-1 overflow-y-auto p-8 bg-white relative">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-800">Detalle de Recorrida (#{{ selectedRecord.id }})</h2>
              <p class="text-slate-500 font-medium">Fecha: {{ selectedRecord.fecha | date:'dd/MM/yyyy' }}</p>
            </div>
            <button type="button" (click)="$event.preventDefault(); editar(selectedRecord)" class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition">
              Editar Registro
            </button>
          </div>
          
          <div class="space-y-6">
            <div>
              <p class="text-sm font-bold text-slate-500">Inspector a cargo</p>
              <p class="text-base text-slate-800 font-medium">{{ selectedRecord.responsable_nombre || selectedRecord.inspector || '-' }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Monitoreo Roedores</p>
                <span [ngClass]="selectedRecord.chk_roedores === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_roedores }}</span>
                <p *ngIf="selectedRecord.comentario_roedores && selectedRecord.comentario_roedores !== 'null' && selectedRecord.comentario_roedores !== '-' && selectedRecord.comentario_roedores !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_roedores }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Equipos de Protección (EPP)</p>
                <span [ngClass]="selectedRecord.chk_epp === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_epp }}</span>
                <p *ngIf="selectedRecord.comentario_epp && selectedRecord.comentario_epp !== 'null' && selectedRecord.comentario_epp !== '-' && selectedRecord.comentario_epp !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_epp }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Higiene Baños</p>
                <span [ngClass]="selectedRecord.chk_banos === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_banos }}</span>
                <p *ngIf="selectedRecord.comentario_banos && selectedRecord.comentario_banos !== 'null' && selectedRecord.comentario_banos !== '-' && selectedRecord.comentario_banos !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_banos }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Higiene Comedor</p>
                <span [ngClass]="selectedRecord.chk_comedor === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_comedor }}</span>
                <p *ngIf="selectedRecord.comentario_comedor && selectedRecord.comentario_comedor !== 'null' && selectedRecord.comentario_comedor !== '-' && selectedRecord.comentario_comedor !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_comedor }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Higiene Molino Diario</p>
                <span [ngClass]="selectedRecord.chk_molino_diario === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_molino_diario }}</span>
                <p *ngIf="selectedRecord.comentario_molino_diario && selectedRecord.comentario_molino_diario !== 'null' && selectedRecord.comentario_molino_diario !== '-' && selectedRecord.comentario_molino_diario !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_molino_diario }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p class="font-bold text-slate-700 mb-1">Cerramientos y Aberturas</p>
                <span [ngClass]="selectedRecord.chk_aberturas === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded inline-block mb-2">{{ selectedRecord.chk_aberturas }}</span>
                <p *ngIf="selectedRecord.comentario_aberturas && selectedRecord.comentario_aberturas !== 'null' && selectedRecord.comentario_aberturas !== '-' && selectedRecord.comentario_aberturas !== ''" class="text-sm text-slate-600">Obs: {{ selectedRecord.comentario_aberturas }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50" *ngIf="isCreating || isEditing">
          <div>
            <h2 class="text-xl font-black text-slate-800">{{ isCreating ? 'Nueva Recorrida RDP' : 'Editar Recorrida' }}</h2>
            <p class="text-sm text-slate-500 font-medium">Inspector a cargo: <span class="font-bold text-indigo-600">{{ inspectorName }}</span></p>
          </div>
          <button type="button" (click)="$event.preventDefault(); submitForm()"  [disabled]="isLoading" class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition disabled:opacity-50">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar y Enviar') }}
          </button>
        </div>

        <!-- Módulo de Edición/Creación -->
        <div class="flex-1 overflow-y-auto p-8" *ngIf="isCreating || isEditing">
          <form [formGroup]="recorridaForm" class="space-y-8 max-w-2xl mx-auto">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Fecha</label>
                <input type="date" formControlName="fecha" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 bg-white focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Inspector</label>
                <input type="text" formControlName="responsable_nombre" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 bg-white focus:ring-indigo-500">
              </div>
            </div>

            <div *ngFor="let item of items" class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <span class="text-lg font-black text-slate-700">{{ item.label }}</span>
                <!-- Bloques Toggle CUMPLE / NO CUMPLE -->
                <div class="flex bg-slate-200 p-1 rounded-lg mt-3 md:mt-0">
                  <button type="button" (click)="$event.preventDefault(); recorridaForm.get(item.formControlName)?.setValue('CUMPLE')" 
                    [class]="recorridaForm.get(item.formControlName)?.value === 'CUMPLE' ? 'bg-green-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'"
                    class="px-6 py-2 rounded-md font-bold text-sm transition-all duration-200">
                    CUMPLE
                  </button>
                  <button type="button" (click)="$event.preventDefault(); recorridaForm.get(item.formControlName)?.setValue('NO CUMPLE')" 
                    [class]="recorridaForm.get(item.formControlName)?.value === 'NO CUMPLE' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'"
                    class="px-6 py-2 rounded-md font-bold text-sm transition-all duration-200 ml-1">
                    NO CUMPLE
                  </button>
                </div>
              </div>
              <textarea 
                [formControlName]="item.commentControlName" 
                rows="2" 
                placeholder="Observaciones o comentarios (Opcional)" 
                class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-white text-sm">
              </textarea>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class RecorridaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  inspectorName = '';
  isLoading = false;
  isCreating = false;
  isViewing = false;
  isEditing = false;
  selectedRecord: any = null;
  
  recorridas: any[] = [];

  items = [
    { label: 'Monitoreo Roedores', formControlName: 'chk_roedores', commentControlName: 'comentario_roedores' },
    { label: 'Uso de Equipos de Protección (EPP)', formControlName: 'chk_epp', commentControlName: 'comentario_epp' },
    { label: 'Higiene Baños', formControlName: 'chk_banos', commentControlName: 'comentario_banos' },
    { label: 'Higiene Comedor', formControlName: 'chk_comedor', commentControlName: 'comentario_comedor' },
    { label: 'Higiene Molino Diario', formControlName: 'chk_molino_diario', commentControlName: 'comentario_molino_diario' },
    { label: 'Cerramientos y Aberturas', formControlName: 'chk_aberturas', commentControlName: 'comentario_aberturas' }
  ];

  recorridaForm: FormGroup;

  constructor() {
    this.recorridaForm = this.fb.group({
      chk_roedores: ['CUMPLE', Validators.required],
      comentario_roedores: [''],
      chk_epp: ['CUMPLE', Validators.required],
      comentario_epp: [''],
      chk_banos: ['CUMPLE', Validators.required],
      comentario_banos: [''],
      chk_comedor: ['CUMPLE', Validators.required],
      comentario_comedor: [''],
      chk_molino_diario: ['CUMPLE', Validators.required],
      comentario_molino_diario: [''],
      chk_aberturas: ['CUMPLE', Validators.required],
      comentario_aberturas: [''],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      responsable_nombre: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    this.inspectorName = user?.username || user?.email || 'Inspector Desconocido';
    this.recorridaForm.patchValue({ responsable_nombre: this.inspectorName });
    this.fetchRecorridas();
  }

  fetchRecorridas() {
    this.recorridas = [];
    this.http.get<any[]>(`${environment.apiUrl}/api/auditoria/recorridas`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.recorridas = data;
        }
      },
      error: (err) => console.error('Error fetching recorridas', err)
    });
  }

  crearNuevo() {
    this.isCreating = true;
    this.isViewing = false;
    this.isEditing = false;
    this.selectedRecord = null;
    this.recorridaForm.reset();
    // Restaurar defaults necesarios
    this.recorridaForm.patchValue({
      chk_roedores: 'CUMPLE', chk_epp: 'CUMPLE', chk_banos: 'CUMPLE',
      chk_comedor: 'CUMPLE', chk_molino_diario: 'CUMPLE', chk_aberturas: 'CUMPLE',
      fecha: new Date().toISOString().split('T')[0], responsable_nombre: this.inspectorName
    });
  }

  verDetalle(record: any) { 
    this.isCreating = false; 
    this.isEditing = false; 
    this.isViewing = true; 
    this.selectedRecord = record; 
  }

  editar(record: any) { 
    this.isCreating = false; 
    this.isViewing = false; 
    this.isEditing = true; 
    this.selectedRecord = record; 
    this.recorridaForm.patchValue(record); 
  }

  submitForm() {
    if (this.recorridaForm.invalid) return;

    this.isLoading = true;
    const formData = new FormData();
    
    // Adjuntar los campos del formulario
    Object.keys(this.recorridaForm.value).forEach(key => {
      formData.append(key, this.recorridaForm.value[key]);
    });

    const endpoint = this.selectedRecord 
      ? `${environment.apiUrl}/api/auditoria/recorridas/${this.selectedRecord.id}` 
      : `${environment.apiUrl}/api/auditoria/recorridas`;
    
    const method = this.selectedRecord ? this.http.put(endpoint, formData) : this.http.post(endpoint, formData);

    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Recorrida guardada exitosamente.', 'success');
        this.isLoading = false;
        this.isEditing = false; 
        this.isCreating = false; 
        this.isViewing = true;
        this.fetchRecorridas();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
        this.isLoading = false;
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar esta recorrida?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/api/auditoria/recorridas/${id}`).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Recorrida eliminada con éxito.', 'success');
            this.recorridas = this.recorridas.filter(r => r.id !== id);
            if (this.selectedRecord?.id === id) {
              this.selectedRecord = null;
              this.isViewing = false;
              this.isEditing = false;
            }
          },
          error: (err) => Swal.fire('Error', 'Error al eliminar.', 'error')
        });
      }
    });
  }

  eliminar(id: any) { this.delete(id); }
}
