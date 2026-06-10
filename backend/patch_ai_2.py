import re

file_path = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\backend\src\infrastructure\http\controllers\AiController.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_block = """      const viajesOptimizados = viajes.map((v: any) => ({
        chofer: v.chofer_email,
        salida: v.Origen?.nombre_lugar || v.lugar_salida,
        llegada: v.Destino?.nombre_lugar || v.lugar_llegada,
        kilos: v.kg_carga,
        producto: v.Carga?.nombre_carga || v.carga_transportada
      }));
      viajesOptimizadosRef = viajesOptimizados;
      systemData += 'Últimos 15 viajes: ' + JSON.stringify(viajesOptimizados) + '\\n';"""

new_block = """      const viajesOptimizados = viajes.map((v: any) => v.toJSON ? v.toJSON() : v);
      viajesOptimizadosRef = viajesOptimizados;
      systemData += 'Últimos 15 viajes (Con todos los detalles y kilómetros): ' + JSON.stringify(viajesOptimizados) + '\\n';"""

content = content.replace(old_block, new_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
