import re

with open('frontend/src/app/features/viajes/viajes.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Detalle de Carga
combustible_pattern = r'<div class="flex flex-col gap-y-4">\s*<div>\s*<p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Vehículo \(Patente\)</p>.*?</div>\s*</div>'

new_combustible = """<div class="flex flex-col space-y-3 p-4 bg-white rounded-lg border border-slate-200">
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Vehículo (Patente):</span>
                      <span class="text-gray-900">{{ selectedCombustible.CamionRel?.patente_chasis || selectedCombustible.patente_chasis }}</span>
                    </div>
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Litros de Gasoil:</span>
                      <span class="text-gray-900">{{ selectedCombustible.litros_gasoil }} L</span>
                    </div>
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Kilometraje:</span>
                      <span class="text-gray-900">{{ selectedCombustible.kilometraje }} KM</span>
                    </div>
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Consumo Promedio:</span>
                      <span class="text-gray-900">{{ selectedCombustible.consumo_l_100km > 0 ? (selectedCombustible.consumo_l_100km | number:'1.2-2') + ' L/100km' : 'Primera carga' }}</span>
                    </div>
                    <div *ngIf="selectedCombustible.foto_tablero || selectedCombustible.foto_url" class="flex flex-col mb-2">
                      <span class="font-bold text-gray-700">Evidencia (Tablero):</span>
                      <img [src]="getImageUrl(selectedCombustible.foto_url || selectedCombustible.foto_tablero)" class="w-full max-h-64 object-contain bg-slate-100 rounded shadow-md border mt-2" alt="Evidencia">
                    </div>
                  </div>"""

text = re.sub(combustible_pattern, new_combustible, text, flags=re.DOTALL)

# Fix Detalle del Service
service_pattern = r'<div class="flex flex-col gap-y-4">\s*<div>\s*<p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Vehículo \(Patente\)</p>.*?</div>\s*</div>\s*</div>'

new_service = """<div class="flex flex-col space-y-3 p-4 bg-white rounded-lg border border-slate-200">
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Vehículo (Patente):</span>
                      <span class="text-gray-900">{{ selectedService.CamionRel?.patente_chasis || selectedService.patente_chasis }}</span>
                    </div>
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Kilómetros Actuales:</span>
                      <span class="text-gray-900">{{ selectedService.km }} KM</span>
                    </div>
                    <div class="flex flex-col mb-2 border-b border-slate-100 pb-2">
                      <span class="font-bold text-gray-700">Próximo Cambio de Filtro:</span>
                      <span class="text-gray-900">{{ selectedService.proximo_cambio_filtro }} KM</span>
                    </div>
                    
                    <div class="flex flex-col mb-2 pt-2">
                      <span class="font-bold text-gray-700 mb-2">Checklist de Mantenimiento:</span>
                      <div class="flex flex-col space-y-2">
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.aceite_motor ? '✅' : '❌' }} Aceite de Motor</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.aire ? '✅' : '❌' }} Filtro de Aire</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.aceite ? '✅' : '❌' }} Filtro de Aceite</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.combustible ? '✅' : '❌' }} Filtro de Combustible</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.hidraulico ? '✅' : '❌' }} Hidráulico</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.caja ? '✅' : '❌' }} Caja</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.diferencial ? '✅' : '❌' }} Diferencial</span>
                        </div>
                        <div class="flex flex-col">
                           <span class="text-sm text-gray-600">{{ selectedService.lubricacion_chasis ? '✅' : '❌' }} Lubricación Chasis</span>
                        </div>
                      </div>
                    </div>
                  </div>"""

text = re.sub(service_pattern, new_service, text, flags=re.DOTALL)

with open('frontend/src/app/features/viajes/viajes.component.ts', 'w', encoding='utf-8') as f:
    f.write(text)

