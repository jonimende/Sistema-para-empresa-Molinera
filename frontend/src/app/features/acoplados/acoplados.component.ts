import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-acoplados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './acoplados.component.html'
})
export class AcopladosComponent implements OnInit {
  acopladosList: any[] = [];
  choferesList: any[] = [];
  form!: FormGroup;
  
  isCreating: boolean = false;
  isViewing: boolean = false;
  selectedAcoplado: any = null;
  selectedAcopladoId: number | null = null;
  
  isLoading: boolean = false;

  apiUrl = `${environment.apiUrl}/api/logistica/acoplados`;
  choferesUrl = `${environment.apiUrl}/logistica/choferes`;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAcoplados();
    this.loadChoferes();
  }

  initForm(): void {
    this.form = this.fb.group({
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      chofer: ['', Validators.required],
      patente_acoplado: ['', Validators.required],
      mant_lona: ['', Validators.required],
      mant_pollera: ['', Validators.required],
      verificacion_luces: ['', Validators.required],
      verificacion_frenos: ['', Validators.required],
      verificacion_hojas_elastico: ['', Validators.required],
      engrase_mensual: ['', Validators.required],
      lavado_acoplado: ['', Validators.required],
      ajuste_reemplazo_tapa: ['', Validators.required],
      observaciones: [''],
      se_reparo: ['', Validators.required]
    });
  }

  loadAcoplados(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.acopladosList = data,
      error: (err) => console.error('Error cargando acoplados', err)
    });
  }

  loadChoferes(): void {
    this.http.get<any[]>(this.choferesUrl).subscribe({
      next: (data) => {
        this.choferesList = data;
      },
      error: (err) => console.error('Error cargando choferes', err)
    });
  }

  setOption(field: string, value: string): void {
    this.form.get(field)?.setValue(value);
  }

  getOptionClasses(field: string, value: string): string {
    const isSelected = this.form.get(field)?.value === value;
    if (isSelected) {
      if (value === 'Bueno' || value === 'SI') {
        return 'bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-[1.02] transition-all';
      } else {
        return 'bg-rose-500 text-white border-rose-500 shadow-md transform scale-[1.02] transition-all';
      }
    }
    return 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50';
  }

  save(): void {
    if (this.form.invalid) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.isLoading = true;

    if (this.selectedAcopladoId) {
      this.http.put(`${this.apiUrl}/${this.selectedAcopladoId}`, this.form.value).subscribe({
        next: () => {
          this.loadAcoplados();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          alert(err.error?.error || 'Error al actualizar');
          this.isLoading = false;
        }
      });
    } else {
      this.http.post(this.apiUrl, this.form.value).subscribe({
        next: () => {
          this.loadAcoplados();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          alert(err.error?.error || 'Error al guardar');
          this.isLoading = false;
        }
      });
    }
  }

  verDetalle(item: any): void {
    this.selectedAcoplado = item;
    this.isViewing = true;
    this.isCreating = false;
    this.selectedAcopladoId = null;
  }

  edit(item: any): void {
    this.isCreating = true;
    this.isViewing = false;
    this.selectedAcopladoId = item.id;
    this.form.patchValue(item);
  }

  deleteItem(id: number): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadAcoplados();
          if (this.selectedAcoplado?.id === id) {
            this.resetForm();
          }
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  resetForm(): void {
    this.isCreating = false;
    this.isViewing = false;
    this.selectedAcopladoId = null;
    this.selectedAcoplado = null;
    this.initForm();
  }
}
