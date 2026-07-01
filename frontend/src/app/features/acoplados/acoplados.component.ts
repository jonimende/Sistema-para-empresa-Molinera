import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

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

  apiUrl = `${environment.apiUrl}/logistica/acoplados`;
  choferesUrl = `${environment.apiUrl}/logistica/choferes`;
  catAcopladosUrl = `${environment.apiUrl}/logistica/cat-acoplados`;
  catAcoplados: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAcoplados();
    this.loadChoferes();
    this.loadCatAcoplados();
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

  loadCatAcoplados(): void {
    this.http.get<any[]>(this.catAcopladosUrl).subscribe({
      next: (data) => this.catAcoplados = data.filter(c => c.estado !== false),
      error: (err) => console.error('Error cargando cat acoplados', err)
    });
  }

  async onAcopladoChange(event: any) {
    if (event.target.value === 'AGREGAR_NUEVO') {
      const { value: nuevo } = await Swal.fire({
        title: 'Agregar nuevo acoplado',
        input: 'text',
        inputPlaceholder: 'Ingrese la patente del acoplado',
        showCancelButton: true
      });
      if (nuevo) {
        this.http.post(this.catAcopladosUrl, { nombre: nuevo.toUpperCase() }).subscribe({
          next: (res: any) => {
            this.catAcoplados.push(res);
            this.form.patchValue({ patente_acoplado: res.nombre });
            Swal.fire('Éxito', 'Acoplado agregado.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo agregar.', 'error')
        });
      } else {
        this.form.patchValue({ patente_acoplado: '' });
      }
    }
  }

  deleteCatAcoplado(id: number) {
    Swal.fire({
      title: '¿Ocultar acoplado?',
      text: 'No aparecerá más en la lista.',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.http.put(`${this.catAcopladosUrl}/${id}`, { estado: false }).subscribe({
          next: () => {
            this.loadCatAcoplados();
            Swal.fire('Ocultado', 'Acoplado ocultado.', 'success');
          },
          error: () => Swal.fire('Error', 'Error al ocultar.', 'error')
        });
      }
    });
  }

  getAcopladoIdByNombre(nombre: string): number {
    const found = this.catAcoplados.find(c => c.nombre === nombre);
    return found ? found.id : 0;
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
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, complete todos los campos obligatorios.', confirmButtonColor: '#4f46e5' });
      return;
    }

    this.isLoading = true;

    if (this.selectedAcopladoId) {
      this.http.put(`${this.apiUrl}/${this.selectedAcopladoId}`, this.form.value).subscribe({
        next: () => {
          this.loadAcoplados();
          this.resetForm();
          this.isLoading = false;
          Swal.fire({ icon: 'success', title: 'Actualizado correctamente', showConfirmButton: false, timer: 1500 });
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar', text: err.error?.message || err.error?.error || err.message || 'Error desconocido al actualizar', confirmButtonColor: '#ef4444' });
          this.isLoading = false;
        }
      });
    } else {
      this.http.post(this.apiUrl, this.form.value).subscribe({
        next: () => {
          this.loadAcoplados();
          this.resetForm();
          this.isLoading = false;
          Swal.fire({ icon: 'success', title: 'Guardado correctamente', showConfirmButton: false, timer: 1500 });
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error al guardar', text: err.error?.message || err.error?.error || err.message || 'Error desconocido al guardar', confirmButtonColor: '#ef4444' });
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
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => {
            this.loadAcoplados();
            if (this.selectedAcoplado?.id === id) {
              this.resetForm();
            }
            Swal.fire({ icon: 'success', title: 'Eliminado', showConfirmButton: false, timer: 1500 });
          },
          error: (err) => Swal.fire({ icon: 'error', title: 'Error al eliminar', text: err.error?.message || err.message, confirmButtonColor: '#ef4444' })
        });
      }
    });
  }

  resetForm(): void {
    this.isCreating = false;
    this.isViewing = false;
    this.selectedAcopladoId = null;
    this.selectedAcoplado = null;
    this.initForm();
  }
}
