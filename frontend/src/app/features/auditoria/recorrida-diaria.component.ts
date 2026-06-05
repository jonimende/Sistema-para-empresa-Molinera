import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recorrida-diaria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <header class="mb-8 border-b pb-4 border-slate-200">
        <h2 class="text-2xl font-black text-slate-800">Módulo de Auditoría: Recorrida Diaria (RDP)</h2>
        <p class="text-slate-500 font-medium">Inspección de Planta y Validaciones de Seguridad.</p>
      </header>

      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form class="space-y-8">
          
          <div class="space-y-6">
            <!-- Item 1 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Monitoreo Roedores</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_roe" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_roe" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>

            <!-- Item 2 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Equipos de Protección (EPP)</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_epp" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_epp" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>

            <!-- Item 3 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Higiene Baños</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_ban" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_ban" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>

            <!-- Item 4 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Higiene Comedor</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_com" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_com" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>

            <!-- Item 5 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Higiene Molino Diario</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_mol" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_mol" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>

            <!-- Item 6 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="font-bold text-slate-700">Aberturas/Cerramientos</div>
              <div class="flex space-x-4">
                <label class="flex items-center text-green-700 font-bold"><input type="radio" name="r_abe" class="mr-2 text-green-600 focus:ring-green-500" checked> CUMPLE</label>
                <label class="flex items-center text-red-700 font-bold"><input type="radio" name="r_abe" class="mr-2 text-red-600 focus:ring-red-500"> NO CUMPLE</label>
              </div>
              <div><input type="text" placeholder="Comentarios..." class="w-full py-2 px-3 rounded-md border border-slate-200"></div>
            </div>
          </div>

          <button type="button" class="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition">Firmar y Enviar Auditoría</button>
        </form>
      </div>
    </div>
  `
})
export class RecorridaDiariaComponent {}
