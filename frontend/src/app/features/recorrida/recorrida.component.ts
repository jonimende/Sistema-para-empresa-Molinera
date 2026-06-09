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
  template: `    <div class="h-auto md:h-[calc(100vh-12rem)] min-h-[60vh] flex flex-col md:flex-row gap-6 w-full relative">
      
      <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-2xl overflow-y-auto shadow-sm max-h-[80vh] md:max-h-full" 
           [ngClass]="{'hidden md:flex flex-col': isCreating || isViewing || isEditing, 'flex flex-col': !(isCreating || isViewing || isEditing)}">
        
        <div class="p-6 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-slate-800">Recorrida Diaria</h2>
            <p class="text-sm text-slate-500 font-medium">Control de Planta</p>
          </div>
          <button type="button" (click)="crearNuevo()" class="hidden md:flex px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition text-sm items-center shadow-sm">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nueva
          </button>
        </div>
        
        <div class="flex-1 p-4 space-y-3 bg-slate-50">
          <div *ngFor="let r of recorridas" 
               (click)="verDetalle(r)"
               [class.border-indigo-500]="selectedRecord?.id === r.id"
               [class.bg-indigo-50]="selectedRecord?.id === r.id"
               class="p-4 border border-slate-200 bg-white rounded-xl hover:bg-indigo-50 cursor-pointer transition shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-1 rounded">RDP #{{ r.id }}</span>
              <span class="text-xs text-slate-500 font-bold">{{ r.fecha | date:'dd/MM/yyyy' }}</span>
            </div>
            <p class="font-bold text-slate-700 mt-2">Inspector: {{ r.responsable_nombre || r.inspector || '-' }}</p>
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wide">Checks completados</p>
              <div class="flex space-x-2">
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); editar(r)" class="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); delete(r.id)" class="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="recorridas.length === 0" class="text-center text-slate-400 py-6 text-sm font-medium">No hay recorridas registradas.</p>
        </div>
      </div>

      <div class="w-full md:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-y-auto" 
           [ngClass]="{'hidden md:flex flex-col': !(isCreating || isViewing || isEditing), 'flex flex-col h-full w-full': isCreating || isViewing || isEditing}">
        
        <button *ngIf="isCreating || isViewing || isEditing" (click)="isCreating=false; isViewing=false; isEditing=false; selectedRecord=null" class="md:hidden m-4 w-[calc(100%-2rem)] bg-slate-100 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center text-lg shadow-sm active:scale-95 transition-all sticky top-4 z-20 border border-slate-200">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          Volver a la Lista
        </button>

        <div *ngIf="!isCreating && !isEditing && !isViewing" class="h-full hidden md:flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 absolute inset-0">
          <svg class="w-20 h-20 text-slate-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-2xl font-black text-slate-600">Ningún Registro Seleccionado</h3>
          <p class="text-slate-500 mt-2 font-medium">Seleccione una recorrida del historial o cree una nueva.</p>
        </div>

        <div *ngIf="isViewing && selectedRecord" class="flex-1 p-6 md:p-8 bg-white relative">
          <div class="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-800">Detalle de Recorrida (#{{ selectedRecord.id }})</h2>
              <p class="text-slate-500 font-medium text-lg md:text-base mt-1">Fecha: <span class="text-indigo-600 font-bold">{{ selectedRecord.fecha | date:'dd/MM/yyyy' }}</span></p>
            </div>
            <button type="button" (click)="$event.preventDefault(); editar(selectedRecord)" class="w-full md:w-auto px-6 py-4 md:py-2 bg-indigo-100 text-indigo-700 font-bold text-xl md:text-base rounded-xl md:rounded-lg hover:bg-indigo-200 transition shadow-sm">
              Editar Registro
            </button>
          </div>
          
          <div class="flex flex-col space-y-6">
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p class="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Inspector a cargo</p>
              <p class="text-xl md:text-lg text-slate-800 font-black">{{ selectedRecord.responsable_nombre || selectedRecord.inspector || '-' }}</p>
            </div>
            
            <div class="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Monitoreo Roedores</p>
                <span [ngClass]="selectedRecord.chk_roedores === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_roedores }}</span>
                <p *ngIf="selectedRecord.comentario_roedores && selectedRecord.comentario_roedores !== 'null' && selectedRecord.comentario_roedores !== '-' && selectedRecord.comentario_roedores !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_roedores }}</p>
              </div>
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Equipos de Protección (EPP)</p>
                <span [ngClass]="selectedRecord.chk_epp === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_epp }}</span>
                <p *ngIf="selectedRecord.comentario_epp && selectedRecord.comentario_epp !== 'null' && selectedRecord.comentario_epp !== '-' && selectedRecord.comentario_epp !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_epp }}</p>
              </div>
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Higiene Baños</p>
                <span [ngClass]="selectedRecord.chk_banos === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_banos }}</span>
                <p *ngIf="selectedRecord.comentario_banos && selectedRecord.comentario_banos !== 'null' && selectedRecord.comentario_banos !== '-' && selectedRecord.comentario_banos !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_banos }}</p>
              </div>
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Higiene Comedor</p>
                <span [ngClass]="selectedRecord.chk_comedor === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_comedor }}</span>
                <p *ngIf="selectedRecord.comentario_comedor && selectedRecord.comentario_comedor !== 'null' && selectedRecord.comentario_comedor !== '-' && selectedRecord.comentario_comedor !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_comedor }}</p>
              </div>
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Higiene Molino Diario</p>
                <span [ngClass]="selectedRecord.chk_molino_diario === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_molino_diario }}</span>
                <p *ngIf="selectedRecord.comentario_molino_diario && selectedRecord.comentario_molino_diario !== 'null' && selectedRecord.comentario_molino_diario !== '-' && selectedRecord.comentario_molino_diario !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_molino_diario }}</p>
              </div>
              <div class="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <p class="font-black text-slate-700 mb-3 text-lg md:text-base">Cerramientos y Aberturas</p>
                <span [ngClass]="selectedRecord.chk_aberturas === 'CUMPLE' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" class="text-sm font-black px-4 py-2 md:px-3 md:py-1 rounded-lg inline-block w-fit mb-3">{{ selectedRecord.chk_aberturas }}</span>
                <p *ngIf="selectedRecord.comentario_aberturas && selectedRecord.comentario_aberturas !== 'null' && selectedRecord.comentario_aberturas !== '-' && selectedRecord.comentario_aberturas !== ''" class="text-base md:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100"><span class="not-italic font-bold text-slate-500">Obs:</span> {{ selectedRecord.comentario_aberturas }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 md:p-8 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center bg-white sticky top-0 z-10 shadow-sm" *ngIf="isCreating || isEditing">
          <div class="mb-6 md:mb-0">
            <h2 class="text-2xl font-black text-slate-800">{{ isCreating ? 'Nueva Recorrida RDP' : 'Editar Recorrida' }}</h2>
            <p class="text-lg md:text-base text-slate-500 font-medium mt-1">Inspector a cargo: <span class="font-black text-indigo-600">{{ inspectorName }}</span></p>
          </div>
          <button type="button" (click)="$event.preventDefault(); submitForm()" [disabled]="isLoading" class="w-full md:w-auto px-8 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar y Enviar') }}
          </button>
        </div>

        <div class="flex-1 p-4 md:p-8 bg-slate-50" *ngIf="isCreating || isEditing">
          <form [formGroup]="recorridaForm" class="flex flex-col space-y-6 md:space-y-8 max-w-3xl mx-auto">
            
            <div class="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex flex-col">
                <label class="text-base font-bold text-slate-700 mb-2">Fecha</label>
                <input type="date" formControlName="fecha" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </div>
              <div class="flex flex-col">
                <label class="text-base font-bold text-slate-700 mb-2">Inspector</label>
                <input type="text" formControlName="responsable_nombre" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </div>
            </div>

            <div *ngFor="let item of items" class="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-5">
              <div class="flex flex-col md:flex-row md:items-center justify-between">
                <span class="text-xl md:text-lg font-black text-slate-800 mb-4 md:mb-0">{{ item.label }}</span>
                <div class="flex space-x-2 w-full md:w-auto">
                  <button type="button" (click)="$event.preventDefault(); recorridaForm.get(item.formControlName)?.setValue('CUMPLE')" 
                    [class]="recorridaForm.get(item.formControlName)?.value === 'CUMPLE' ? 'bg-green-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                    class="flex-1 md:flex-none px-4 md:px-6 py-4 md:py-3 rounded-xl font-black text-lg md:text-base transition-all duration-200 flex justify-center items-center">
                    CUMPLE
                  </button>
                  <button type="button" (click)="$event.preventDefault(); recorridaForm.get(item.formControlName)?.setValue('NO CUMPLE')" 
                    [class]="recorridaForm.get(item.formControlName)?.value === 'NO CUMPLE' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                    class="flex-1 md:flex-none px-4 md:px-6 py-4 md:py-3 rounded-xl font-black text-lg md:text-base transition-all duration-200 flex justify-center items-center">
                    NO CUMPLE
                  </button>
                </div>
              </div>
              <textarea 
                [formControlName]="item.commentControlName" 
                rows="2" 
                placeholder="Observaciones o comentarios (Opcional)" 
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </textarea>
            </div>
          </form>
          
          <div class="mt-8 flex justify-end">
            <button type="button" (click)="$event.preventDefault(); submitForm()" [disabled]="isLoading" class="w-full md:w-auto px-8 py-5 md:py-4 bg-indigo-600 text-white font-black text-xl rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
              {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Finalizar y Enviar') }}
            </button>
          </div>

        </div>
      </div>

      <button *ngIf="!(isCreating || isViewing || isEditing)" 
              (click)="crearNuevo()" 
              class="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-black z-[60] hover:bg-indigo-700 active:scale-95 transition-transform border-4 border-white">
        +
      </button>

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
    this.http.get<any[]>(`${environment.apiUrl}/auditoria/recorridas`).subscribe({
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
      ? `${environment.apiUrl}/auditoria/recorridas/${this.selectedRecord.id}` 
      : `${environment.apiUrl}/auditoria/recorridas`;
    
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
        this.http.delete(`${environment.apiUrl}/auditoria/recorridas/${id}`).subscribe({
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