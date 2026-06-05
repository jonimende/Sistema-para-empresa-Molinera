import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viajes-logistica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <header class="mb-8 border-b pb-4 border-slate-200">
        <h2 class="text-2xl font-black text-slate-800">Módulo de Logística: Viajes</h2>
        <p class="text-slate-500 font-medium">Control y Emisión de Despachos de Carga.</p>
      </header>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Fecha y Hora</label>
              <input type="datetime-local" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Chofer Designado</label>
              <input type="text" placeholder="Nombre completo" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Patente Camión</label>
              <input type="text" placeholder="AB 123 CD" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Patente Acoplado</label>
              <input type="text" placeholder="EF 456 GH" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div class="md:col-span-2 border-t pt-6 mt-2">
              <label class="block text-sm font-bold text-slate-700 mb-1">Producto Cargado</label>
              <select class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
                <option>Arroz Blanco 00000</option>
                <option>Arroz Blanco 0000</option>
                <option>Medio Grano</option>
                <option>Arrocín</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Destino Final</label>
              <input type="text" placeholder="Ej: Puerto Rosario" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Peso Neto (Kilos)</label>
              <div class="relative">
                <input type="number" placeholder="30000" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
                <span class="absolute right-3 top-2.5 text-slate-400 font-bold">KG</span>
              </div>
            </div>
          </div>

          <button type="button" class="w-full py-4 mt-8 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition">Generar Viaje Oficial</button>
        </form>
      </div>
    </div>
  `
})
export class CargaCombustibleComponent {}
