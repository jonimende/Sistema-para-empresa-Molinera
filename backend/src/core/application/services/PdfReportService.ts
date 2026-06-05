import { Vehiculo } from '../../../infrastructure/database/sequelize/models/Vehiculo';
import { CargaCombustible } from '../../../infrastructure/database/sequelize/models/CargaCombustible';
import { Chofer } from '../../../infrastructure/database/sequelize/models/Chofer';

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
// Resuelve la estructura exportada por vfs_fonts según la versión y el entorno (NodeJS vs Webpack)
pdfMake.vfs = (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) || pdfFonts.vfs || pdfFonts;

export class PdfReportService {
  async generarReporteConsumo(vehiculo_id: number): Promise<Buffer> {
    const vehiculo = await Vehiculo.findByPk(vehiculo_id, {
      include: [
        { model: Chofer, as: 'chofer_asignado' },
        { 
          model: CargaCombustible, 
          as: 'cargas',
          order: [['fecha', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!vehiculo) throw new Error('Vehículo no encontrado');

    const cargasRows = (vehiculo as any).cargas.map((c: any) => [
      c.fecha.toISOString().split('T')[0],
      `${c.litros_gasoil} L`,
      `${c.kilometraje} km`,
      c.consumo_l_100km ? `${c.consumo_l_100km} L/100km` : 'N/A'
    ]);

    const docDefinition: any = {
      content: [
        { text: 'ERP MOLINO - Reporte de Logística', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        { text: `Vehículo (Patente/Chasis): ${(vehiculo as any).patente_chasis}`, fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        { text: `Chofer Asignado: ${(vehiculo as any).chofer_asignado?.nombre_y_apellido || 'Sin Asignar'}`, margin: [0, 0, 0, 20] },
        { text: 'Últimas 10 Cargas de Combustible:', fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Fecha', bold: true, fillColor: '#eeeeee' },
                { text: 'Litros', bold: true, fillColor: '#eeeeee' },
                { text: 'Kilometraje', bold: true, fillColor: '#eeeeee' },
                { text: 'Consumo', bold: true, fillColor: '#eeeeee' }
              ],
              ...cargasRows
            ]
          }
        }
      ]
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBuffer((buffer: Buffer) => {
          resolve(buffer);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
