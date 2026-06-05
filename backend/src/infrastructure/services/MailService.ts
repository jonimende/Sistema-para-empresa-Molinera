import nodemailer from 'nodemailer';
import exceljs from 'exceljs';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Envía un correo electrónico con un reporte en HTML, adjuntando opcionalmente un Excel generado al vuelo.
   *
   * @param destinatario - Dirección de correo electrónico del receptor.
   * @param asunto - Asunto del correo.
   * @param mensajeHtml - Cuerpo del correo en formato HTML.
   * @param datosParaExcel - Array de objetos a volcar en el archivo Excel (Opcional).
   */
  public async enviarReporteConAdjunto(
    destinatario: string,
    asunto: string,
    mensajeHtml: string,
    datosParaExcel?: any[]
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Paoloni IA" <${process.env.SMTP_USER}>`,
        to: destinatario,
        subject: asunto,
        html: mensajeHtml,
      };

      if (datosParaExcel && datosParaExcel.length > 0) {
        // Crear workbook y worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');

        // Extraer las claves del primer objeto para crear los encabezados (Headers)
        const columns = Object.keys(datosParaExcel[0]).map((key) => ({
          header: key.toUpperCase(),
          key: key,
          width: 20,
        }));
        
        worksheet.columns = columns;

        // Añadir filas
        worksheet.addRows(datosParaExcel);

        // Generar buffer en memoria
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // Añadir el adjunto a las opciones de correo
        mailOptions.attachments = [
          {
            filename: 'reporte.xlsx',
            content: Buffer.from(excelBuffer),
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ];
      }

      // Envío a través del Transporter
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Correo enviado con éxito. MessageId:', info.messageId);
    } catch (error) {
      console.error('❌ Error enviando el correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  }

  /**
   * Envía un correo electrónico con un reporte en formato PDF adjunto en memoria.
   */
  public async enviarPdfConAdjunto(
    destinatario: string,
    asunto: string,
    mensajeHtml: string,
    pdfBuffer: Buffer,
    nombreArchivo: string = 'Control_Higiene.pdf'
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Paoloni IA" <${process.env.SMTP_USER}>`,
        to: destinatario,
        subject: asunto,
        html: mensajeHtml,
        attachments: [
          {
            filename: nombreArchivo,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Correo PDF enviado con éxito. MessageId:', info.messageId);
    } catch (error) {
      console.error('❌ Error enviando el correo PDF:', error);
      throw new Error('No se pudo enviar el correo con PDF.');
    }
  }
}
