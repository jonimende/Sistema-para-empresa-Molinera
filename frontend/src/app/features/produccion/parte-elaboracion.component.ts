import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parte-elaboracion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <header class="mb-8 border-b pb-4 border-slate-200">
        <h2 class="text-2xl font-black text-slate-800">Módulo de Producción: Parte de Elaboración (Molienda)</h2>
        <p class="text-slate-500 font-medium">Registro de rendimiento del molino y operarios.</p>
      </header>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="md:col-span-2 border-b pb-4 mb-2">
               <h3 class="text-lg font-bold text-slate-700">1. Trazabilidad Inicial</h3>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Silo de Origen (Materia Prima)</label>
              <select class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
                <option>Silo 1 - Arroz Cáscara</option>
                <option>Silo 2 - Arroz Cáscara Seco</option>
                <option>Tolva de Ingreso A</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Producto a Elaborar</label>
              <select class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
                <option>Arroz Blanco Largo Fino</option>
                <option>Arroz Blanco 00000</option>
              </select>
            </div>

            <div class="md:col-span-2 border-b pb-4 mb-2 mt-4">
               <h3 class="text-lg font-bold text-slate-700">2. Balanzas de Proceso</h3>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Kilos de Entrada (Bruto)</label>
              <div class="relative">
                <input type="number" placeholder="Ej: 50000" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50 font-mono text-lg">
                <span class="absolute right-3 top-3 text-slate-400 font-bold">KG</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Kilos de Salida (Terminado)</label>
              <div class="relative">
                <input type="number" placeholder="Ej: 32000" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50 font-mono text-lg text-indigo-700">
                <span class="absolute right-3 top-3 text-indigo-300 font-bold">KG</span>
              </div>
            </div>

            <div class="md:col-span-2 bg-slate-100 p-6 rounded-xl flex items-center justify-between border border-slate-200 my-4">
               <div>
                 <span class="block text-sm font-bold text-slate-500 uppercase tracking-wider">Cálculo Automático</span>
                 <span class="block text-xl font-black text-slate-800">Rendimiento Estimado del Molino</span>
               </div>
               <div class="text-4xl font-black text-green-600">64.00%</div>
            </div>

            <div class="md:col-span-2 border-b pb-4 mb-2">
               <h3 class="text-lg font-bold text-slate-700">3. Aprobación</h3>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-slate-700 mb-1">Nombre del Operario Responsable</label>
              <input type="text" placeholder="Firma digital del molinero" class="w-full border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3 bg-slate-50">
            </div>

          </div>

          <button type="button" class="w-full py-4 mt-8 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition">Sellar Parte de Elaboración</button>
        </form>
      </div>
    </div>
  `
})
export class ParteElaboracionComponent {}
