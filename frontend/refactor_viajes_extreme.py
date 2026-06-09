import re

filepath = r'c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\viajes\viajes.component.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update combustible form
content = re.sub(
    r'<label class="text-sm font-bold text-slate-700 mb-1\.5 ml-1">',
    r'<label class="text-base font-bold text-slate-700 mb-2">',
    content
)
content = re.sub(
    r'class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base',
    r'class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base',
    content
)
content = re.sub(
    r'class="w-full bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-base text-indigo-700 shadow-sm font-bold"',
    r'class="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 md:p-3 text-lg md:text-base text-indigo-700 shadow-sm font-bold"',
    content
)

# 2. Update all buttons that have `py-3.5 md:py-2.5` to `py-4 text-xl` in viajes
content = re.sub(
    r'px-6 py-3\.5 md:py-2\.5 bg-indigo-600 text-white font-black text-lg md:text-base rounded-xl md:rounded-lg shadow-md',
    r'px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md mt-4 md:mt-0',
    content
)

# 3. Viaje Form specifically
old_viaje = """                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Comprobante</label>
                      <select formControlName="comprobante_relacionado" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 font-bold text-indigo-700">
                        <option value="REMITO">REMITO</option>
                        <option value="CARTA DE PORTE">CARTA DE PORTE</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Nro Comprobante</label>
                      <input type="text" formControlName="numero_comprobante" placeholder="Ej: R-0001-00001234" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 font-mono font-bold">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Fecha Salida</label>
                      <input type="date" formControlName="fecha_salida" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Carga (KG)</label>
                      <input type="number" formControlName="kg_carga" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Lugar de Llegada (Manual)</label>
                      <input type="text" formControlName="lugar_llegada" placeholder="Destino libre..." class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Destino (Sucursal Frecuente)</label>
                      <select formControlName="destino_id" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                        <option value="" disabled selected>Seleccione Destino Frecuente...</option>
                        <option *ngFor="let d of destinos" [value]="d.id">{{ d.nombre_lugar }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Vehículo</label>
                      <select formControlName="camion_id" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500">
                        <option value="" disabled selected>Seleccione Vehículo...</option>
                        <option *ngFor="let c of camiones" [value]="c.id">{{ c.patente_chasis }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-slate-700 mb-1">Email Chofer</label>
                      <input type="email" formControlName="chofer_email" class="w-full border-slate-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 bg-slate-100" readonly>
                    </div>
                  </div>
                  
                  <div class="flex justify-end pt-4">
                    <button type="button" (click)="$event.preventDefault(); submitViaje()" [disabled]="viajeForm.invalid || isLoading" class="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50">Guardar Viaje</button>
                  </div>"""

new_viaje = """                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Comprobante</label>
                      <select formControlName="comprobante_relacionado" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base font-bold text-indigo-700 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                        <option value="REMITO">REMITO</option>
                        <option value="CARTA DE PORTE">CARTA DE PORTE</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Nro Comprobante</label>
                      <input type="text" formControlName="numero_comprobante" placeholder="Ej: R-0001-00001234" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors font-mono font-bold">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Fecha Salida</label>
                      <input type="date" formControlName="fecha_salida" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Carga (KG)</label>
                      <input type="number" formControlName="kg_carga" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Lugar de Llegada (Manual)</label>
                      <input type="text" formControlName="lugar_llegada" placeholder="Destino libre..." class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Destino (Sucursal Frecuente)</label>
                      <select formControlName="destino_id" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                        <option value="" disabled selected>Seleccione Destino Frecuente...</option>
                        <option *ngFor="let d of destinos" [value]="d.id">{{ d.nombre_lugar }}</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Vehículo</label>
                      <select formControlName="camion_id" class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors">
                        <option value="" disabled selected>Seleccione Vehículo...</option>
                        <option *ngFor="let c of camiones" [value]="c.id">{{ c.patente_chasis }}</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-base font-bold text-slate-700 mb-2">Email Chofer</label>
                      <input type="email" formControlName="chofer_email" class="w-full bg-slate-100 border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors" readonly>
                    </div>
                  </div>
                  
                  <div class="pt-4 flex flex-col md:flex-row md:justify-end border-t border-slate-100">
                    <button type="button" (click)="$event.preventDefault(); submitViaje()" [disabled]="viajeForm.invalid || isLoading" class="w-full md:w-auto px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base rounded-xl md:rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 mt-4 md:mt-0">
                      Guardar Viaje
                    </button>
                  </div>"""

content = content.replace(old_viaje, new_viaje)

# Fix camion form sizes since I modified them before, I will upgrade to the extreme sizes
old_camion = """class="w-full bg-white border border-slate-300 rounded-lg p-3 text-base"""
new_camion = """class="w-full bg-white border border-slate-300 rounded-xl p-4 md:p-3 text-lg md:text-base"""
content = content.replace(old_camion, new_camion)

old_camion_label = """class="text-sm font-bold text-slate-700 mb-1.5 ml-1\""""
new_camion_label = """class="text-base font-bold text-slate-700 mb-2\""""
content = content.replace(old_camion_label, new_camion_label)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
