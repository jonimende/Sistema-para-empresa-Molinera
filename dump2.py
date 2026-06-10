import re

with open('frontend/src/app/features/viajes/viajes.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Combustible
c_match = re.search(r'(<h4 class="font-black text-xl text-slate-800">Detalle de Carga</h4>.*?</form>)', text, re.DOTALL)
if c_match:
    print("COMB:")
    print(c_match.group(1)[:1500])

s_match = re.search(r'(<h4 class="font-black text-xl text-slate-800">Detalle del Service</h4>.*?</form>)', text, re.DOTALL)
if s_match:
    print("\n\nSERV:")
    print(s_match.group(1)[:1500])

