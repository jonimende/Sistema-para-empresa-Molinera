import re

with open('frontend/src/app/features/viajes/viajes.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Detalle de Carga (Combustible Detail)
# We want to change the grid to flex-col.
# Let's find the inner container for Detalle de Carga.
combustible_detail_match = re.search(r'(<div \*ngIf="isViewingCombustible && !selectedCombustibleId".*?<h4 class="font-black text-xl text-slate-800">Detalle de Carga</h4>.*?)(<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">)(.*?)(</div>\s*</div>\s*<!-- Modo Formulario)', text, re.DOTALL)

if combustible_detail_match:
    # Instead of grid grid-cols-1 sm:grid-cols-2, we use flex flex-col gap-y-6
    # Or just grid grid-cols-1 gap-y-4
    text = text[:combustible_detail_match.start(2)] + '<div class="flex flex-col gap-y-4">' + text[combustible_detail_match.end(2):]

# Fix Detalle de Service
service_detail_match = re.search(r'(<div \*ngIf="isViewingService && !selectedServiceId".*?<h4 class="font-black text-xl text-slate-800">Detalle del Service</h4>.*?)(<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">)(.*?)(</div>\s*</div>\s*<!-- Modo Formulario)', text, re.DOTALL)

if service_detail_match:
    text = text[:service_detail_match.start(2)] + '<div class="flex flex-col gap-y-4">' + text[service_detail_match.end(2):]


with open('frontend/src/app/features/viajes/viajes.component.ts', 'w', encoding='utf-8') as f:
    f.write(text)

