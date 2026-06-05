import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] flex gap-6">
      <!-- Izquierda: Lista de NCs -->
      <div class="w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-slate-800">Historial NC</h2>
            <p class="text-sm text-slate-500 font-medium">No Conformidades Registradas</p>
          </div>
          <button type="button" (click)="$event.preventDefault(); crearNuevo()"  class="px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition text-sm flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nueva NC
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Iterar Lista Real -->
          <div *ngFor="let nc of ncs" 
               (click)="verDetalle(nc)"
               [class.border-indigo-500]="selectedRecord?.id === nc.id"
               [class.bg-indigo-50]="selectedRecord?.id === nc.id"
               class="p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 cursor-pointer transition">
            <div class="flex justify-between items-center mb-2">
              <span [ngClass]="nc.gravedad === 'CRÍTICA' ? 'text-red-700 bg-red-100' : 'text-yellow-700 bg-yellow-100'" 
                    class="text-xs font-bold px-2 py-1 rounded">{{ nc.gravedad }}</span>
              <span class="text-xs text-slate-400 font-bold">{{ nc.fecha }}</span>
            </div>
            <p class="font-bold text-slate-700">{{ nc.requisito_incumplido }}</p>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
              <p class="text-sm text-slate-500">Sector: {{ nc.ubicacion }}</p>
              <div class="flex space-x-2">
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); editar(nc)"  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" (click)="$event.preventDefault(); $event.stopPropagation(); eliminar(nc.id)"  class="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="ncs.length === 0" class="text-center text-slate-400 py-4 text-sm">No hay NCs registradas.</p>
        </div>
      </div>

      <!-- Derecha: Formulario NC -->
      <div class="w-2/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
        
        <!-- Estado Vacío -->
        <div *ngIf="!isCreating && !isEditing && !isViewing" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10">
          <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h3 class="text-xl font-bold text-slate-600">Ninguna NC Seleccionada</h3>
          <p class="text-slate-500 mt-1">Seleccione una No Conformidad del historial o reporte una nueva.</p>
        </div>

        <!-- Modo Lectura -->
        <div *ngIf="isViewing && selectedRecord" class="flex-1 overflow-y-auto p-8 bg-white relative">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-800">Detalle de No Conformidad</h2>
              <p class="text-slate-500 font-medium">Requisito: {{ selectedRecord.requisito_incumplido }}</p>
            </div>
            <button type="button" (click)="$event.preventDefault(); editar(selectedRecord)" class="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition">
              Editar NC
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-bold text-slate-500">Ubicación</p>
                <p class="text-base text-slate-800 font-medium">{{ selectedRecord.ubicacion || '-' }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-500">Responsable</p>
                <p class="text-base text-slate-800 font-medium">{{ selectedRecord.nombre_responsable || selectedRecord.responsable || '-' }}</p>
              </div>
            </div>
            
            <div>
              <p class="text-sm font-bold text-slate-500">Descripción</p>
              <p class="text-base text-slate-800 font-medium mt-1 p-4 bg-slate-50 rounded-lg border border-slate-100">{{ selectedRecord.descripcion || '-' }}</p>
            </div>

              <div class="mt-4" *ngIf="getImageUrl(selectedRecord?.foto_url || selectedRecord?.foto) !== ''">
                <span class="text-xs font-bold text-gray-500 uppercase">Evidencia Fotográfica</span>
                <div class="mt-2 w-full h-64 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                  <img [src]="getImageUrl(selectedRecord?.foto_url || selectedRecord?.foto)" alt="Evidencia NC" class="w-full h-full object-contain">
                </div>
              </div>
          </div>
        </div>

        <!-- Cabecera Formulario -->
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50" *ngIf="isCreating || isEditing">
          <div>
            <h2 class="text-xl font-black text-slate-800">{{ isCreating ? 'Nueva No Conformidad' : 'Editar No Conformidad' }}</h2>
            <p class="text-sm text-slate-500 font-medium">Registre el hallazgo con evidencia fotográfica.</p>
          </div>
          <button type="button" (click)="$event.preventDefault(); submitForm()"  [disabled]="isLoading" class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition disabled:opacity-50">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar NC') }}
          </button>
        </div>

        <!-- Formulario -->
        <div class="flex-1 overflow-y-auto p-8" *ngIf="isCreating || isEditing">
          <form [formGroup]="ncForm" class="space-y-6 max-w-2xl mx-auto">
            
              <!-- Requisito Incumplido -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Requisito Incumplido</label>
                <input type="text" formControlName="requisito_incumplido" placeholder="Ej: BPM 4.2" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
              </div>

            <!-- Descripción -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Descripción Detallada del Hallazgo</label>
              <textarea 
                formControlName="descripcion" 
                rows="4" 
                placeholder="Describa el problema encontrado..." 
                class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50"></textarea>
            </div>

            <!-- Ubicación -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Ubicación</label>
              <input type="text" formControlName="ubicacion" placeholder="Lugar exacto del hallazgo" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>

            <!-- Responsable -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Responsable No Conformidad</label>
              <input type="text" formControlName="nombre_responsable" placeholder="Nombre de quien reporta" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>

            <!-- Foto Drag & Drop -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Evidencia Fotográfica</label>
              
              <!-- Visor de Foto Existente -->
              <div *ngIf="ncForm.get('foto_url')?.value" class="mb-4">
                <img [src]="getImageUrl(ncForm.get('foto_url')?.value)" class="w-full max-h-64 object-contain bg-slate-100 rounded shadow-md border" alt="Evidencia NC">
                <button type="button" (click)="$event.preventDefault(); ncForm.get('foto_url')?.setValue(''); selectedFile = null; selectedFileName = ''" class="mt-2 text-sm text-red-600 font-bold hover:underline">Reemplazar imagen</button>
              </div>

              <!-- Subida de Archivo -->
              <div *ngIf="!ncForm.get('foto_url')?.value" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition relative">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-slate-600 justify-center">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-1">
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" (change)="onFileSelected($event)">
                    </label>
                    <p class="pl-1">o arrastre y suelte</p>
                  </div>
                  <p class="text-xs text-slate-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </div>
              <p *ngIf="selectedFileName" class="mt-2 text-sm text-green-600 font-bold flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                Archivo seleccionado: {{ selectedFileName }}
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class NcComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  
  isLoading = false;
  isCreating = false;
  isViewing = false;
  isEditing = false;
  selectedRecord: any = null;
  selectedId: number | null = null;
  ncForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  ncs: any[] = [
    { id: 1, gravedad: 'CRÍTICA', fecha: 'Ayer', requisito_incumplido: 'Contaminación en Tolva', ubicacion: 'Producción', descripcion: '', responsable: '' },
    { id: 2, gravedad: 'ALERTA', fecha: 'Hace 3 días', requisito_incumplido: 'Lona de camión rota', ubicacion: 'Logística', descripcion: '', responsable: '' }
  ];

  constructor() {
    this.ncForm = this.fb.group({
      requisito_incumplido: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      nombre_responsable: ['', Validators.required],
      foto_url: ['']
    });
  }

  ngOnInit() {
    this.fetchNCs();
  }

  fetchNCs() {
    this.ncs = [];
    this.http.get<any[]>('http://localhost:3000/api/calidad/nc').subscribe({
      next: (data: any) => {
        const records = data?.data || data || [];
        if (records && records.length > 0) {
          this.ncs = records;
        }
      },
      error: (err) => console.error('Error fetching NCs', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  crearNuevo() {
    this.isCreating = true;
    this.isViewing = false;
    this.isEditing = false;
    this.selectedRecord = null;
    this.selectedId = null;
    this.ncForm.reset();
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  seleccionarRegistro(record: any) {
    this.isCreating = false;
    this.isViewing = false;
    this.isEditing = true;
    this.selectedRecord = record;
    this.selectedId = record.id;
    this.ncForm.patchValue(record);
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  submitForm() {
    if (this.ncForm.invalid) {
      Swal.fire('Atención', 'Por favor complete los campos obligatorios.', 'warning');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    
    // Adjuntar los campos de texto
    const formValues = this.ncForm.value;
    Object.keys(formValues).forEach(key => {
      if (key !== 'foto' && key !== 'foto_url' && formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    // Adjuntar el archivo si existe y es un File real
    if (this.selectedFile instanceof File) {
      formData.append('foto', this.selectedFile);
    }

    const endpoint = this.selectedId 
      ? `http://localhost:3000/api/calidad/nc/${this.selectedId}` 
      : 'http://localhost:3000/api/calidad/nc';
    
    const method = this.selectedId ? this.http.put(endpoint, formData) : this.http.post(endpoint, formData);

    method.subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'No Conformidad registrada exitosamente.', 'success');
        this.isLoading = false;
        this.isCreating = false;
        this.isEditing = false;
        this.isViewing = false;
        this.selectedRecord = null;
        this.selectedId = null;
        this.ncForm.reset();
        this.selectedFile = null;
        this.selectedFileName = '';
        this.fetchNCs();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al guardar.', 'error');
        this.isLoading = false;
      }
    });
  }

  edit(id: number) {
    const record = this.ncs.find(r => r.id === id);
    if (record) {
      this.seleccionarRegistro(record);
    }
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar esta No Conformidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/api/calidad/nc/${id}`).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'No Conformidad eliminada con éxito.', 'success');
            this.ncs = this.ncs.filter(r => r.id !== id);
            if (this.selectedRecord?.id === id) {
              this.selectedRecord = null;
            }
          },
          error: (err) => Swal.fire('Error', 'Error al eliminar.', 'error')
        });
      }
    });
  }

  verDetalle(nc: any) {
    this.isCreating = false; 
    this.isEditing = false; 
    this.isViewing = true; 
    this.selectedRecord = nc;
  }

  getImageUrl(ruta: string | any): string {
    // Filtramos nulos reales y strings literales de nulos
    if (!ruta || String(ruta).trim() === 'null' || String(ruta).trim() === 'undefined' || String(ruta).trim() === '') {
      return '';
    }
    if (ruta.startsWith('http')) return ruta;
    const baseUrl = 'http://localhost:3000';
    return ruta.startsWith('/') ? baseUrl + ruta : baseUrl + '/' + ruta;
  }

  
  
  

  editar(item: any) { this.seleccionarRegistro(item); }
  eliminar(id: any) { this.delete(id); }
}
