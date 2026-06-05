const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) || pdfFonts.vfs || pdfFonts;
import nodemailer from 'nodemailer';

// Usamos fuentes estandar (Helvetica) para evitar dependencias de archivos de fuentes
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

export class AiReportService {
  static async generarYEnviarReporteIA(kpis: any): Promise<boolean> {
    try {
      // 1. Simulación (Mock) de llamada a OpenAI / Gemini 
      console.log(`[AI-AGENT] Analizando prompt: "Evalúa los siguientes KPIs: ${JSON.stringify(kpis)}"`);
      
      let iaMockResponse = '';
      if (kpis.nc_criticas > 0) {
        iaMockResponse = `ALERTA ESTRATÉGICA: Se han detectado ${kpis.nc_criticas} No Conformidades de nivel Crítico. Se recomienda detener la línea de producción afectada inmediatamente y convocar a la comisión de calidad. La producción mensual es de ${kpis.produccion_total} Kg, pero la inocuidad está en riesgo.`;
      } else {
        iaMockResponse = `ANÁLISIS ESTABLE: La planta opera dentro de los márgenes óptimos. La producción total alcanzó los ${kpis.produccion_total} Kg y el consumo de combustible en logística fue de ${kpis.litros_combustible} Lts. No hay eventos críticos pendientes.`;
      }

      // 2. Generación del Documento PDF en Memoria usando PdfMake
      const docDefinition: any = {
        content: [
          { text: 'Reporte Gerencial Automatizado - ERP Molino', style: 'header' },
          { text: 'Análisis generado por IA', style: 'subheader' },
          { text: '\n\n' },
          { text: 'Métricas Actuales:', style: 'bold' },
          { ul: [
              `Producción Total de Arroz: ${kpis.produccion_total} Kg`,
              `Combustible Consumido (Flota): ${kpis.litros_combustible} Lts`,
              `Fallas Operativas Abiertas: ${kpis.nc_abiertas}`,
              `Eventos Críticos: ${kpis.nc_criticas}`
            ]
          },
          { text: '\n\n' },
          { text: 'Dictamen de la Inteligencia Artificial:', style: 'bold' },
          { text: iaMockResponse, italics: true, color: kpis.nc_criticas > 0 ? 'red' : 'blue' }
        ],
        styles: {
          header: { fontSize: 22, bold: true, alignment: 'center' as const },
          subheader: { fontSize: 14, alignment: 'center' as const, color: 'gray' },
          bold: { bold: true, fontSize: 12, margin: [0, 5, 0, 5] as [number, number, number, number] }
        },
        defaultStyle: { font: 'Roboto' }
      };

      return new Promise((resolve) => {
        try {
          const pdfDocGenerator = pdfMake.createPdf(docDefinition);
          pdfDocGenerator.getBuffer(async (buffer: Buffer) => {
            const resultPdf = buffer;
            
            // 3. Envío del PDF por correo usando Ethereal (Sandbox para desarrollo)
            try {
              const testAccount = await nodemailer.createTestAccount();
              const transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass }
              });

              const info = await transporter.sendMail({
                from: '"ERP AI Agent" <ai-agent@molinopaoloni.com>',
                to: 'gerencia@molinopaoloni.com',
                subject: 'Alerta/Reporte Analítico Diario (IA)',
                text: 'Se adjunta el análisis gerencial del turno actual.',
                attachments: [{ filename: 'Analisis_Operativo_IA.pdf', content: resultPdf }]
              });

              console.log('[MAILER] Email despachado. Previsualización (URL): %s', nodemailer.getTestMessageUrl(info));
              resolve(true);
            } catch (mailErr) {
              console.error('Error enviando el correo simulado:', mailErr);
              resolve(false); // No frenar si la red falla
            }
          });
        } catch (e) {
          console.error('Error generando PDF:', e);
          resolve(false);
        }
      });
    } catch (error) {
      console.error('Error general en el Agente IA:', error);
      return false;
    }
  }
}
