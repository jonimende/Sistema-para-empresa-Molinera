import re

filepath = r'c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\nc\nc.component.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Refactor the form
old_form = """          <form [formGroup]="ncForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
              
              <!-- Requisito Incumplido -->
              <div class="flex flex-col">
                <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Requisito Incumplido</label>
                <input type="text" formControlName="requisito_incumplido" placeholder="Ej: BPM 4.2" class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Ubicación -->
              <div class="flex flex-col">
                <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Ubicación</label>
                <input type="text" formControlName="ubicacion" placeholder="Lugar exacto del hallazgo" class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Responsable -->
              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Responsable No Conformidad</label>
                <input type="text" formControlName="nombre_responsable" placeholder="Nombre de quien reporta" class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Descripción -->
              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Descripción Detallada del Hallazgo</label>
                <textarea 
                  formControlName="descripcion" 
                  rows="4" 
                  placeholder="Describa el problema encontrado..." 
                  class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors"></textarea>
              </div>
            </div>"""

new_form = """          <form [formGroup]="ncForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
              
              <!-- Requisito Incumplido -->
              <div class="flex flex-col">
                <label class="text-base font-bold text-slate-700 mb-2">Requisito Incumplido</label>
                <input type="text" formControlName="requisito_incumplido" placeholder="Ej: BPM 4.2" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Ubicación -->
              <div class="flex flex-col">
                <label class="text-base font-bold text-slate-700 mb-2">Ubicación</label>
                <input type="text" formControlName="ubicacion" placeholder="Lugar exacto del hallazgo" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Responsable -->
              <div class="flex flex-col md:col-span-2">
                <label class="text-base font-bold text-slate-700 mb-2">Responsable No Conformidad</label>
                <input type="text" formControlName="nombre_responsable" placeholder="Nombre de quien reporta" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
              </div>

              <!-- Descripción -->
              <div class="flex flex-col md:col-span-2">
                <label class="text-base font-bold text-slate-700 mb-2">Descripción Detallada del Hallazgo</label>
                <textarea 
                  formControlName="descripcion" 
                  rows="4" 
                  placeholder="Describa el problema encontrado..." 
                  class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors"></textarea>
              </div>
            </div>"""

content = content.replace(old_form, new_form)

# Refactor the button
old_btn = """<button type="button" (click)="$event.preventDefault(); submitForm()" [disabled]="isLoading" class="w-full md:w-auto px-6 py-3.5 md:py-2.5 md:ml-auto bg-indigo-600 text-white font-black text-lg md:text-base rounded-xl md:rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar NC') }}
          </button>"""

new_btn = """<button type="button" (click)="$event.preventDefault(); submitForm()" [disabled]="isLoading" class="w-full md:w-auto px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 mt-4 md:mt-0">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar NC') }}
          </button>"""

content = content.replace(old_btn, new_btn)

# Ensure the list of NCs uses cards (it already uses cards in nc.component.ts)
# Checking existing list logic in nc.component.ts:
# It's already using a card list:
# <div *ngFor="let nc of ncs" ... class="p-4 border ...">
# That's fine, no table used in NC.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
