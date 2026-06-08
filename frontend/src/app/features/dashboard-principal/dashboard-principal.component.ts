import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-principal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-principal.component.html'
})
export class DashboardPrincipalComponent implements OnInit {
  stats: any = { totalUsuarios: 0, totalViajes: 0, totalRecorridas: 0 };
  notificaciones: any[] = [];
  usuarios: any[] = [];
  usuarioForm: FormGroup;
  modoEdicion = false;
  usuarioEditId: number | null = null;
  
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarUsuarios();
  }

  cargarDashboard() {
    this.http.get<any>(`${environment.apiUrl}/dashboard`).subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.notificaciones = res.actividadReciente;
      },
      error: () => console.error('Error cargando dashboard')
    });
  }

  cargarUsuarios() {
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (res) => this.usuarios = res,
      error: () => console.error('Error cargando usuarios')
    });
  }

  editarUsuario(u: any) {
    this.modoEdicion = true;
    this.usuarioEditId = u.id;
    this.usuarioForm.patchValue({
      email: u.email,
      role: u.role,
      password: '' // Vacío por seguridad
    });
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) return;

    const payload = this.usuarioForm.value;
    
    if (this.modoEdicion && this.usuarioEditId) {
      this.http.put(`${environment.apiUrl}/usuarios/${this.usuarioEditId}`, payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Usuario actualizado correctamente.', 'success');
          this.resetForm();
          this.cargarUsuarios();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error')
      });
    } else {
      if(!payload.password) {
        Swal.fire('Atención', 'La contraseña es obligatoria para nuevos usuarios.', 'warning');
        return;
      }
      this.http.post(`${environment.apiUrl}/usuarios`, payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Usuario creado correctamente.', 'success');
          this.resetForm();
          this.cargarUsuarios();
          this.cargarDashboard(); // Actualiza contadores
        },
        error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo crear.', 'error')
      });
    }
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/usuarios/${id}`).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado exitosamente.', 'success');
            this.cargarUsuarios();
            this.cargarDashboard();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error')
        });
      }
    });
  }

  resetForm() {
    this.modoEdicion = false;
    this.usuarioEditId = null;
    this.usuarioForm.reset({ role: '' });
  }
}
