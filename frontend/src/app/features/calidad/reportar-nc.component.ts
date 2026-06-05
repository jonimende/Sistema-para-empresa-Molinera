import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reportar-nc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div class="mb-8 border-b border-slate-100 pb-5">
        <h2 class="text-2xl font-bold text-slate-800">Reportar No Conformidad (NC)</h2>
        <p class="text-slate-500 text-sm mt-1">Adjunte la evidencia fotográfica y clasifique la desviación detectada.</p>
      </div>

      <form [formGroup]="ncForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Sector Involucrado</label>
            <select formControlName="sector" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none">
              <option value="Producción">Producción</option>
              <option value="Logística">Logística</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Laboratorio">Laboratorio</option>
              <option value="Higiene">Higiene</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Gravedad</label>
            <select formControlName="gravedad" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica (Riesgo Inocuidad/Seguridad)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Descripción de la Falla / Problema</label>
          <textarea formControlName="descripcion" rows="4" placeholder="Detalle lo sucedido de forma clara..."
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none resize-none"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Evidencia Fotográfica</label>
          <input type="file" (change)="onFileSelected($event)" accept="image/*"
                 class="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-slate-200 rounded-lg bg-slate-50">
        </div>

        <div class="pt-6 border-t border-slate-100 flex justify-end space-x-3">
          <button type="button" (click)="$event.preventDefault(); undefined"  class="px-6 py-2.5 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" 
                  [disabled]="ncForm.invalid || isSubmitting"
                  class="px-8 py-2.5 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all">
            {{ isSubmitting ? 'Subiendo Archivos...' : 'Reportar Inmediatamente' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ReportarNcComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  public router = inject(Router);

  ncForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor() {
    this.ncForm = this.fb.group({
      sector: ['Producción', Validators.required],
      gravedad: ['Media', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  onSubmit() {
    if (this.ncForm.valid) {
      this.isSubmitting = true;
      
      // FormData permite encapsular tanto texto como el binario Multipart
      const formData = new FormData();
      const formValues = this.ncForm.value;
      
      Object.keys(formValues).forEach(key => {
        if (formValues[key] !== null && formValues[key] !== undefined) {
          formData.append(key, formValues[key]);
        }
      });
      
      if (this.selectedFile) {
        formData.append('foto', this.selectedFile);
      }

      this.http.post(`${environment.apiUrl}/calidad/no-conformidades`, formData).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'No Conformidad generada y notificada con éxito.', 'success');
          this.isSubmitting = false;
          this.selectedFile = null;
          this.router.navigate(['/calidad/dashboard']);
        },
        error: (err) => {
          Swal.fire('Error', 'Error de conexión o archivo demasiado grande (Máx 5MB).', 'error');
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }

  verDetalle(item: any) {
    let html = '<div class="text-left text-sm" style="max-height: 400px; overflow-y: auto;">';
    for (let key in item) {
      if (key === "firma_inspector" || key === "firma_chofer") {
        if (item[key]) {
          html += '<p><strong>' + key + ':</strong><br><img src="' + item[key] + '" class="w-full max-w-xs border rounded mt-1"></p>';
        }
      } else {
        html += '<p><strong>' + key + ':</strong> ' + item[key] + '</p>';
      }
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
}
