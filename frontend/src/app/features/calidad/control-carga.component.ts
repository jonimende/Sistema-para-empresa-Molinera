import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-carga',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <header class="mb-8 border-b pb-4 border-slate-200">
        <h2 class="text-2xl font-black text-slate-800">Módulo PCC: Control de Higiene de Carga</h2>
        <p class="text-slate-500 font-medium">Wizard de Aprobación Logística.</p>
      </header>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <!-- Wizard Pasos -->
        <div class="flex items-center mb-8">
          <div class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow">1</div>
          <div class="h-1 flex-1 bg-slate-200 mx-4"></div>
          <div class="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold">2</div>
          <div class="h-1 flex-1 bg-slate-200 mx-4"></div>
          <div class="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold">3</div>
        </div>

        <!-- Paso Activo -->
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-slate-700 border-b pb-2">Paso 1: Datos de Viaje</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Chofer</label>
              <input type="text" placeholder="Nombre completo" class="w-full border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Vehículo / Patente</label>
              <input type="text" placeholder="AAA-123" class="w-full border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Producto</label>
              <select class="w-full border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50">
                <option>Arroz Blanco 00000</option>
                <option>Medio Grano</option>
                <option>Arrocín</option>
              </select>
            </div>
          </div>

          <h3 class="text-xl font-bold text-slate-700 border-b pb-2 mt-8">Paso 2: Checklist de Higiene</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <label class="flex items-center p-4 border rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100">
               <input type="checkbox" class="w-5 h-5 text-indigo-600 rounded mr-3"> <span class="font-bold text-slate-700">Libre de Olores Extraños</span>
             </label>
             <label class="flex items-center p-4 border rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100">
               <input type="checkbox" class="w-5 h-5 text-indigo-600 rounded mr-3"> <span class="font-bold text-slate-700">Libre de Insectos/Plagas</span>
             </label>
             <label class="flex items-center p-4 border rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100">
               <input type="checkbox" class="w-5 h-5 text-indigo-600 rounded mr-3"> <span class="font-bold text-slate-700">Sin Humedad Evidente</span>
             </label>
             <label class="flex items-center p-4 border rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100">
               <input type="checkbox" class="w-5 h-5 text-indigo-600 rounded mr-3"> <span class="font-bold text-slate-700">Lona Sana e Íntegra</span>
             </label>
          </div>

          <h3 class="text-xl font-bold text-slate-700 border-b pb-2 mt-8">Paso 3: Aprobación Final</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Kilos a Cargar</label>
              <input type="number" placeholder="Ej: 30000" class="w-full border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Lote Asignado</label>
              <input type="text" placeholder="Lote-XYZ" class="w-full border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50">
            </div>
          </div>
          
          <div class="mt-4">
             <label class="block text-sm font-bold text-slate-700 mb-2">Firma del Inspector (Canvas)</label>
             <div class="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
               <span class="pointer-events-none">[ Área de Firma Táctil ]</span>
             </div>
          </div>

        </div>

        <div class="flex justify-end mt-10">
          <button type="button" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Completar Control PCC</button>
        </div>
      </div>
    </div>
  `
})
export class ControlCargaComponent {}
