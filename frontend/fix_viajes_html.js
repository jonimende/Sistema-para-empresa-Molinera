const fs = require('fs');
let file = 'C:/Users/JereM/OneDrive/Desktop/Paoloni/frontend/src/app/features/viajes/viajes.component.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<option value="AB123CD">AB123CD<\/option>/g, '<option *ngFor="let c of camiones" [value]="c.patente_chasis">{{ c.patente_chasis }}</option>');

// Fix + Nuevo in Higiene component? No, this is viajes, Camiones:
content = content.replace(/isCreatingViaje = !isCreatingViaje/g, (match, offset, str) => {
    // Check context
    let leftContext = str.substring(Math.max(0, offset - 100), offset);
    if (leftContext.includes('Registro de Combustible')) return 'isCreatingCombustible = !isCreatingCombustible';
    if (leftContext.includes('Mantenimiento de Flota')) return 'isCreatingService = !isCreatingService';
    if (leftContext.includes('Flota Activa')) return 'isCreatingCamion = !isCreatingCamion';
    return match;
});

fs.writeFileSync(file, content, 'utf8');
