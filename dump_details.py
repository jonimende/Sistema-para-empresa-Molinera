import re

with open('frontend/src/app/features/viajes/viajes.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find Detalle de Carga
comb_match = re.search(r'(<div \*ngIf="isViewingCombustible && !selectedCombustibleId".*?)(<!-- Modo Formulario)', text, re.DOTALL)
if comb_match:
    print("----- COMB -----")
    print(comb_match.group(1))

# find Detalle del Service
service_match = re.search(r'(<div \*ngIf="isViewingService && !selectedServiceId".*?)(<!-- Modo Formulario)', text, re.DOTALL)
if service_match:
    print("\n\n----- SERVICE -----")
    print(service_match.group(1))

