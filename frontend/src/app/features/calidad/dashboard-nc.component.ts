import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-nc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <header class="mb-8 border-b pb-4 border-slate-200">
        <h2 class="text-2xl font-black text-slate-800">Módulo de Calidad: No Conformidades</h2>
        <p class="text-slate-500 font-medium">Registro y seguimiento de hallazgos críticos.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Formulario -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Nuevo Registro
          </h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Sector Involucrado</label>
              <select class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
                <option>Producción</option>
                <option>Logística</option>
                <option>Mantenimiento</option>
                <option>Laboratorio</option>
                <option>Higiene</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Gravedad</label>
              <select class="w-full border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 py-2.5 px-3 bg-red-50 text-red-700 font-bold">
                <option>Alerta</option>
                <option>Crítica con Alerta Roja</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Descripción del Hallazgo</label>
              <textarea rows="3" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50"></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Acción Inmediata Tomada</label>
              <textarea rows="2" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50"></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Responsable del Registro</label>
              <input type="text" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Evidencia (Captura Única)</label>
              <input type="file" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
            </div>
            <button type="button" class="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Registrar Hallazgo</button>
          </form>
        </div>

        <!-- Historial -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             Historial de la Categoría
          </h3>
          <div class="text-slate-500 text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p>No hay hallazgos registrados para el módulo actual.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardNcComponent {}
