import re

filepath = r'c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\recorrida\recorrida.component.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Form head updates
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

# Buttons upgrade
content = re.sub(
    r'px-6 py-3\.5 md:py-2\.5 bg-indigo-600 text-white font-black text-lg md:text-base',
    r'px-6 py-4 md:py-3 bg-indigo-600 text-white font-black text-xl md:text-base mt-4 md:mt-0',
    content
)

content = re.sub(
    r'px-4 md:px-6 py-3\.5 md:py-2\.5 rounded-md font-bold text-base md:text-sm',
    r'px-4 md:px-6 py-4 md:py-3 rounded-xl font-black text-lg md:text-base',
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
