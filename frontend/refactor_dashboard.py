import re

filepath = r'c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\dashboard-principal\dashboard-principal.component.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the user form
old_form = """        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()" class="space-y-4 md:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div class="flex flex-col">
              <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">
                Contraseña <span *ngIf="modoEdicion" class="text-slate-400 font-normal hidden md:inline">(Vacía = sin cambios)</span>
              </label>
              <input type="password" formControlName="password" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-bold text-slate-700 mb-1.5 ml-1">Rol Operativo</label>
              <select formControlName="role" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                <option value="" disabled selected>Seleccione...</option>
                <option value="Admin">Admin</option>
                <option value="Logistica">Logística</option>
                <option value="Camionero">Camionero</option>
                <option value="Inspector_Calidad">Inspector de Calidad</option>
                <option value="No_Conformidades">No Conformidades</option>
                <option value="Auditoria">Auditoría</option>
              </select>
            </div>
          </div>
          <div class="pt-2 flex flex-col md:flex-row md:justify-end gap-3">
            <button type="button" *ngIf="modoEdicion" (click)="resetForm()" class="w-full md:w-auto px-6 py-3.5 md:py-2.5 bg-slate-100 text-slate-600 font-bold text-lg md:text-base rounded-xl md:rounded-lg hover:bg-slate-200 transition-all flex justify-center items-center">
              Cancelar
            </button>
            <button type="submit" [disabled]="usuarioForm.invalid" class="w-full md:w-auto px-6 py-3.5 md:py-2.5 bg-indigo-600 text-white font-black text-lg md:text-base rounded-xl md:rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
              {{ modoEdicion ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </div>
        </form>"""

new_form = """        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()" class="space-y-6 md:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col">
              <label class="text-base font-bold text-slate-700 mb-2">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
            </div>
            <div class="flex flex-col">
              <label class="text-base font-bold text-slate-700 mb-2">
                Contraseña <span *ngIf="modoEdicion" class="text-slate-400 font-normal block md:inline text-sm mt-1 md:mt-0">(Vacía = sin cambios)</span>
              </label>
              <input type="password" formControlName="password" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
            </div>
            <div class="flex flex-col">
              <label class="text-base font-bold text-slate-700 mb-2">Rol Operativo</label>
              <select formControlName="role" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                <option value="" disabled selected>Seleccione...</option>
                <option value="Admin">Admin</option>
                <option value="Logistica">Logística</option>
                <option value="Camionero">Camionero</option>
                <option value="Inspector_Calidad">Inspector de Calidad</option>
                <option value="No_Conformidades">No Conformidades</option>
                <option value="Auditoria">Auditoría</option>
              </select>
            </div>
          </div>
          <div class="pt-4 flex flex-col md:flex-row md:justify-end gap-3 border-t border-slate-100">
            <button type="button" *ngIf="modoEdicion" (click)="resetForm()" class="w-full md:w-auto px-6 py-4 md:py-3 bg-slate-100 text-slate-600 font-bold text-xl md:text-base rounded-xl md:rounded-lg hover:bg-slate-200 transition-all flex justify-center items-center">
              Cancelar
            </button>
            <button type="submit" [disabled]="usuarioForm.invalid" class="w-full md:w-auto px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50">
              {{ modoEdicion ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </div>
        </form>"""

content = content.replace(old_form, new_form)

# Replace the table with hybrid table/cards
old_table = """      <!-- Tabla Usuarios -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto w-full">
        <table class="w-full text-left min-w-[500px]">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
              <th class="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
              <th class="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let u of usuarios" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-4 md:px-6 py-3 md:py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mr-3 flex-shrink-0">
                    {{ u.email.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-bold text-slate-700 text-sm md:text-base truncate max-w-[120px] md:max-w-none">{{ u.email }}</span>
                </div>
              </td>
              <td class="px-4 md:px-6 py-3 md:py-4">
                <span class="px-2 md:px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[10px] md:text-xs font-bold shadow-sm whitespace-nowrap">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-4 md:px-6 py-3 md:py-4 text-right space-x-2 whitespace-nowrap">
                <button (click)="editarUsuario(u)" class="text-blue-600 hover:text-white hover:bg-blue-600 p-2 min-h-[44px] min-w-[44px] bg-blue-50 rounded-lg transition-colors border border-blue-100 inline-flex items-center justify-center">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button (click)="eliminarUsuario(u.id)" class="text-red-600 hover:text-white hover:bg-red-600 p-2 min-h-[44px] min-w-[44px] bg-red-50 rounded-lg transition-colors border border-red-100 inline-flex items-center justify-center">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>"""

new_table = """      <!-- Tabla Usuarios Híbrida -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 w-full">
        <!-- VISTA MÓVIL: Tarjetas -->
        <div class="grid grid-cols-1 md:hidden gap-4 p-4 bg-slate-50/50">
          <div *ngFor="let u of usuarios" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg">
                  {{ u.email.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-800 text-base break-all">{{ u.email }}</h4>
                  <span class="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold mt-1 inline-block">
                    {{ u.role }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-2 pt-3 border-t border-slate-100">
              <button (click)="editarUsuario(u)" class="flex-1 min-h-[48px] bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Editar
              </button>
              <button (click)="eliminarUsuario(u.id)" class="flex-1 min-h-[48px] bg-red-50 text-red-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- VISTA ESCRITORIO: Tabla -->
        <table class="w-full text-left hidden md:table">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let u of usuarios" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mr-3 flex-shrink-0">
                    {{ u.email.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-bold text-slate-700 text-base">{{ u.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                <button (click)="editarUsuario(u)" class="text-blue-600 hover:text-white hover:bg-blue-600 p-2 min-w-[44px] bg-blue-50 rounded-lg transition-colors border border-blue-100 inline-flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button (click)="eliminarUsuario(u.id)" class="text-red-600 hover:text-white hover:bg-red-600 p-2 min-w-[44px] bg-red-50 rounded-lg transition-colors border border-red-100 inline-flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>"""

content = content.replace(old_table, new_table)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
