import re

file_path = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\backend\src\infrastructure\http\controllers\AiController.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "CargaCombustible" not in content:
    content = content.replace(
        "import { ServiceMantenimiento } from '../../database/sequelize/models/ServiceMantenimiento';",
        "import { ServiceMantenimiento } from '../../database/sequelize/models/ServiceMantenimiento';\nimport { CargaCombustible } from '../../database/sequelize/models/CargaCombustible';"
    )

content = content.replace(
    "const services = await ServiceMantenimiento.findAll({ limit: 10, order: [['createdAt', 'DESC']] });",
    """const services = await ServiceMantenimiento.findAll({ limit: 10, order: [['createdAt', 'DESC']] });
      const combustibles = await CargaCombustible.findAll({ limit: 10, order: [['createdAt', 'DESC']] });"""
)

content = content.replace(
    "systemData += 'Últimos 10 Services: ' + JSON.stringify(services) + '\\n';",
    "systemData += 'Últimos 10 Services: ' + JSON.stringify(services) + '\\n';\n        systemData += 'Últimas 10 Cargas de Combustible: ' + JSON.stringify(combustibles) + '\\n';"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
