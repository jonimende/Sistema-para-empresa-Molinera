import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Viaje } from '../../database/sequelize/models/Viaje';
import { Ubicacion } from '../../database/sequelize/models/Ubicacion';
import { ProductoCarga } from '../../database/sequelize/models/ProductoCarga';
import { MailService } from '../../services/MailService';
import { Op } from 'sequelize';
// Removed PDFKit dependency for email reports
import { ControlCarga } from '../../database/sequelize/models/ControlCarga';
import { NoConformidad } from '../../database/sequelize/models/NoConformidad';
import { ElaboracionParte } from '../../database/sequelize/models/ElaboracionParte';
import { ServiceMantenimiento } from '../../database/sequelize/models/ServiceMantenimiento';
import { CargaCombustible } from '../../database/sequelize/models/CargaCombustible';
import { RecorridaDiaria } from '../../database/sequelize/models/RecorridaDiaria';
import { Vehiculo } from '../../database/sequelize/models/Vehiculo';


export const handleChat = async (req: Request, res: Response) => {
  try {
    const { history, contextModule } = req.body;
    
    if (!history || history.length === 0) {
      return res.status(400).json({ error: 'Historial es requerido' });
    }

    let systemData = '';
    const ctx = contextModule || 'general';

    // Inyectar estado global masivo
    try {
      const [
        viajesFull,
        combustibles,
        services,
        noConformidades,
        controlesCarga,
        partesElaboracion,
        recorridasDiarias,
        vehiculos
      ] = await Promise.all([
        Viaje.findAll({ 
          order: [['createdAt', 'DESC']],
          include: [
            { model: Ubicacion, as: 'Origen', attributes: ['nombre_lugar'] },
            { model: Ubicacion, as: 'Destino', attributes: ['nombre_lugar'] },
            { model: ProductoCarga, as: 'Carga', attributes: ['nombre_carga'] }
          ]
        }),
        CargaCombustible.findAll({ order: [['createdAt', 'DESC']] }),
        ServiceMantenimiento.findAll({ order: [['createdAt', 'DESC']] }),
        NoConformidad.findAll({ order: [['createdAt', 'DESC']] }),
        ControlCarga.findAll({ order: [['createdAt', 'DESC']] }),
        ElaboracionParte.findAll({ order: [['createdAt', 'DESC']] }),
        RecorridaDiaria.findAll({ order: [['createdAt', 'DESC']] }),
        Vehiculo.findAll({ order: [['createdAt', 'DESC']] })
      ]);

      const systemDataObj = {
        logistica: {
          viajes: viajesFull.map((v: any) => ({ id: v.id, orig: v.Origen?.nombre_lugar || v.lugar_salida, dest: v.Destino?.nombre_lugar || v.lugar_llegada, prod: v.Carga?.nombre_carga || v.carga_transportada, km: v.km_recorridos, f: v.fecha_salida, pat: v.patente_camion, chof: v.chofer_email })),
          combust: combustibles.map((c: any) => ({ f: c.fecha, pat: c.patente, lit: c.litros, km: c.km_actual, p: c.precio_total })),
          maint: services.map((s: any) => ({ f: s.fecha, pat: s.patente, km: s.km_service, t: s.tipo_service }))
        },
        calidad: {
          noconf: noConformidades.map((n: any) => ({ f: n.fecha, desc: n.descripcion })),
          recorridas: recorridasDiarias.map((r: any) => ({ f: r.fecha, resp: r.responsable_nombre, roed: r.chk_roedores, epp: r.chk_epp, ban: r.chk_banos, com: r.chk_comedor, mol: r.chk_molino_diario, abert: r.chk_aberturas }))
        },
        HIGIENE_PCC: controlesCarga.map((c: any) => ({
          id: c.id,
          fecha: c.fecha,
          resp: c.responsable_inspeccion,
          trans: c.transporte,
          pat: c.patente,
          prod: c.producto,
          cli: c.cliente,
          clima: c.estado_clima,
          chk_externa: c.chk_externa,
          chk_insectos: c.chk_insectos,
          chk_film: c.chk_film,
          chk_humedad: c.chk_humedad,
          chk_interior: c.chk_interior,
          chk_verificacion: c.chk_verificacion,
          chk_insecticida: c.chk_insecticida,
          obs: c.observaciones_generales,
          fotos: [c.foto_1, c.foto_2, c.foto_3, c.foto_4, c.foto_5, c.foto_6].filter(f => f).length
        })),
        produccion: {
          partes: partesElaboracion.map((p: any) => ({ f: p.fecha, lote: p.nro_lote, prod: p.producto_elaborado, rend_mol: p.molino_rendimiento, rend_molinillo: p.molinillo_rendimiento, enteros: p.molino_enteros, quebrados: p.molino_quebrado, silo: p.silo_origen }))
        },
        maestros: {
          camiones: vehiculos.map((v: any) => ({ pat: v.patente_chasis, marca: v.marca, mod: v.modelo, chof: v.chofer_asignado, cap: v.capacidad_kg }))
        }
      };
      
      systemData += `\n[ESTADO_GLOBAL_EMPRESA]: ${JSON.stringify(systemDataObj)}\n`;
    } catch (err) {
      console.error('Error inyectando estado global:', err);
    }


    const systemPrompt = `Eres el asistente analítico central de la planta. Tienes acceso completo al estado en tiempo real de la empresa en el objeto [ESTADO_GLOBAL_EMPRESA]. Tu deber es cruzar información de logística, calidad y elaboración para responder cualquier consulta gerencial de forma exacta.
  
  ${systemData}
  
  Reglas:
  1. Responde a la pregunta utilizando ÚNICAMENTE los datos proporcionados en [ESTADO_GLOBAL_EMPRESA].
  2. Sé directo, profesional y no pidas disculpas. Haz los cálculos matemáticos cruzando arrays cuando sea necesario.
  3. Si la información no está en los datos, dilo amablemente.
  
  REGLA VITAL: Si el usuario te solicita enviar un correo, reporte o planilla de logística/viajes, TIENES PROHIBIDO decir que lo enviaste usando texto normal. DEBES invocar OBLIGATORIAMENTE la herramienta enviar_reporte_logistica.
  REGLA VITAL 2: Si el usuario solicita información, reportes o planillas sobre control de carga, higiene o limpieza, DEBES invocar OBLIGATORIAMENTE la herramienta enviar_reporte_higiene_pdf.
  REGLA VITAL 3: Si el usuario te pide enviar un reporte pero NO te da un correo electrónico válido (ej. solo te dice un nombre), NO invoques la herramienta. En su lugar, pídele amablemente la dirección de correo electrónico.
  REGLA 4: Memoria de Email. Si el usuario te pide enviar un reporte a 'ese mismo correo' o no menciona el email en su mensaje actual, BUSCA en el historial de la conversación el último correo válido que haya proporcionado y utilízalo.
  REGLA 5: Cero Alucinaciones. NUNCA inventes direcciones de correo electrónico uniendo el nombre y apellido de una persona. Si no encuentras un email válido con @ en el historial, pídeselo explícitamente.
  
  REGLA DE HIGIENE: Ahora tienes acceso a [HIGIENE_PCC]. Cuando el usuario te pida un "Informe de Higiene" de un camión, patente o fecha, DEBES generar un reporte profesional en Markdown con este formato exacto:

📋 INFORME DE CONTROL DE HIGIENE (PCC)

Fecha y Hora: [Fecha]

Inspector Responsable: [Email/Nombre]

Transporte: [Empresa] | Patente: [Patente]

Producto: [Producto] | Cliente: [Cliente]

Clima: [Estado]

✅ Checklist de Calidad:

(Lista aquí las respuestas Sí/No del checklist de forma clara. Si hay un "No", resáltalo en negrita como ALERTA).

📝 Observaciones:

[Observaciones del inspector]

📸 Evidencia Visual:

(Indica cuántas fotos fueron adjuntadas en el control basándote en los campos de imágenes llenos).*`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Falta GEMINI_API_KEY. Retornando respuesta mock.');
      return res.json({ response: `[Mock AI] He recibido tu mensaje en el módulo ${contextModule}. Configura tu GEMINI_API_KEY en el backend para activar el modelo.` });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelId = 'gemini-3.5-flash';
    // const modelId = 'gemini-3.1-pro'; // Opcional para cruzar datos masivos a futuro

    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: systemPrompt,
      tools: [{
        functionDeclarations: [
          {
            name: "enviar_reporte_logistica",
            description: "Envía un correo electrónico con un reporte Excel de los últimos viajes al destinatario indicado por el usuario.",
            parameters: {
              type: "OBJECT" as any,
              properties: {
                destinatario: { type: "STRING" as any, description: "El correo electrónico del destinatario." },
                asunto: { type: "STRING" as any, description: "Asunto del correo generado por la IA." },
                fecha: { type: "STRING" as any, description: "Fecha específica de los viajes. DEBES usar OBLIGATORIAMENTE el formato ISO estricto YYYY-MM-DD (ej: 2026-04-01). No uses barras ni formatos locales." },
                chofer: { type: "STRING" as any, description: "Nombre o correo del chofer para filtrar los viajes." }
              },
              required: ["destinatario", "asunto"]
            }
          },
          {
            name: "enviar_reporte_higiene_pdf",
            description: "Envía un correo electrónico con un reporte PDF de higiene y control de carga al destinatario indicado por el usuario.",
            parameters: {
              type: "OBJECT" as any,
              properties: {
                destinatario: { type: "STRING" as any, description: "El correo electrónico del destinatario." },
                asunto: { type: "STRING" as any, description: "Asunto del correo." },
                fecha: { type: "STRING" as any, description: "Fecha específica. Formato ISO estricto YYYY-MM-DD." },
                chofer: { type: "STRING" as any, description: "Nombre o DNI del chofer para filtrar los registros." }
              },
              required: ["destinatario"]
            }
          }
        ]
      }]
    });

    let validHistory = history.slice(0, -1);
    // Gemini exige estrictamente que el primer mensaje del historial sea 'user'
    while (validHistory.length > 0 && validHistory[0].role !== 'user') {
      validHistory.shift();
    }

    const formattedHistory = validHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    const latestMessage = history[history.length - 1].content;

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(latestMessage);
    const responseMessage = result.response;

    const toolCalls = responseMessage.functionCalls();

    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const args = toolCall.args as any;
        const mailService = new MailService();

        switch (toolCall.name) {
          case 'enviar_reporte_logistica':
            const emailRegexLogistica = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!args.destinatario || !emailRegexLogistica.test(args.destinatario)) {
              return res.json({ response: 'Por favor, indícame una dirección de correo electrónico válida (con @) para poder enviarte el reporte.' });
            }

            let whereClauseViajes: any = {};
            if (args.fecha) {
              whereClauseViajes.fecha_salida = { [Op.like]: `${args.fecha}%` };
            }
            if (args.chofer) {
              whereClauseViajes.chofer_email = { [Op.iLike]: `%${args.chofer}%` };
            }

            const queryOptionsViajes: any = {
              where: whereClauseViajes,
              order: [['createdAt', 'DESC']],
              include: [
                { model: Ubicacion, as: 'Origen', attributes: ['nombre_lugar'] },
                { model: Ubicacion, as: 'Destino', attributes: ['nombre_lugar'] },
                { model: ProductoCarga, as: 'Carga', attributes: ['nombre_carga'] }
              ]
            };
            
            if (!args.fecha) queryOptionsViajes.limit = 50;

            const viajesFull = await Viaje.findAll(queryOptionsViajes);

            const viajesParaExcel = viajesFull.map((v: any) => {
              let fechaLimpia = v.fecha_salida;
              if (fechaLimpia && fechaLimpia.includes('-')) {
                const [yyyy, mm, dd] = fechaLimpia.split('-');
                fechaLimpia = `${parseInt(dd)}/${parseInt(mm)}/${yyyy}`;
              }

              return {
                'FECHA': fechaLimpia,
                'CHOFER': v.chofer_email,
                'ORIGEN': v.Origen?.nombre_lugar || v.lugar_salida,
                'DESTINO': v.Destino?.nombre_lugar || v.lugar_llegada,
                'PRODUCTO': v.Carga?.nombre_carga || v.carga_transportada,
                'KILOS': v.kg_carga,
                'KM RECORRIDOS': v.km_recorridos,
                'NRO COMPROBANTE': v.numero_comprobante
              };
            });

            const totalKm = viajesFull.reduce((sum: number, v: any) => sum + (Number(v.km_recorridos) || 0), 0);

            let htmlTemplateLogistica = `
              <div style="font-family: sans-serif; background-color: #f8fafc; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #4f46e5; text-align: center; margin-bottom: 20px;">Reporte de Logística y Viajes</h2>
                  <p style="color: #333; font-size: 16px;">Hola,</p>
                  <p style="color: #333; font-size: 16px;">Adjunto el reporte detallado solicitado generado por Paoloni IA. A continuación se muestra un resumen rápido de los viajes:</p>
                  
                  <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
                      <thead>
                        <tr style="background-color: #4f46e5; color: white;">
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Fecha</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Chofer</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Origen</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Destino</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Kilos</th>
                          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">KM</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${viajesParaExcel.map((v: any) => `
                          <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['FECHA']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['CHOFER']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['ORIGEN']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['DESTINO']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['PRODUCTO']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['KILOS']}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${v['KM RECORRIDOS'] || 0}</td>
                          </tr>
                        `).join('')}
                        <tr style="background-color: #f1f5f9; font-weight: bold;">
                          <td colspan="6" style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #1e293b;">TOTAL KM RECORRIDOS:</td>
                          <td style="padding: 10px; border: 1px solid #ddd; color: #4f46e5;">${totalKm}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p style="margin-top: 30px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">Generado automáticamente por Paoloni IA</p>
                </div>
              </div>
            `;
            
            viajesParaExcel.push({
              'FECHA': 'TOTALES',
              'CHOFER': '',
              'ORIGEN': '',
              'DESTINO': '',
              'PRODUCTO': '',
              'KILOS': '',
              'KM RECORRIDOS': totalKm,
              'NRO COMPROBANTE': ''
            });

            await mailService.enviarReporteConAdjunto(
              args.destinatario,
              args.asunto,
              htmlTemplateLogistica,
              viajesParaExcel
            );
            
            return res.json({ response: `¡Listo! Acabo de enviar un reporte en Excel a ${args.destinatario} con los datos de viajes solicitados.` });

          case 'enviar_reporte_higiene_pdf':
            const emailRegexHigiene = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!args.destinatario || !emailRegexHigiene.test(args.destinatario)) {
              return res.json({ response: 'Por favor, indícame una dirección de correo electrónico válida (con @) para poder enviarte el reporte.' });
            }

            let whereClauseHigiene: any = {};
            if (args.fecha) {
              whereClauseHigiene.fecha = { [Op.like]: `${args.fecha}%` }; // Assuming date field is 'fecha'
            }
            if (args.chofer) {
              whereClauseHigiene.chofer = { [Op.iLike]: `%${args.chofer}%` };
            }

            const queryOptionsHigiene: any = {
              where: whereClauseHigiene,
              order: [['createdAt', 'DESC']]
            };

            if (!args.fecha) queryOptionsHigiene.limit = 50;

            const registrosHigiene = await ControlCarga.findAll(queryOptionsHigiene);

            let htmlTemplateHigiene = `
              <div style="font-family: sans-serif; background-color: #f8fafc; padding: 20px;">
                <div style="max-width: 700px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 15px; margin-bottom: 25px;">
                    <h1 style="color: #4f46e5; margin: 0; font-size: 28px; letter-spacing: 1px;">PAOLONI</h1>
                    <span style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Control de Calidad e Higiene</span>
                  </div>
                  
                  <h2 style="color: #1e293b; text-align: center; margin-bottom: 25px; font-weight: 600;">Reporte de Higiene y Control de Carga (PCC)</h2>
                  
                  <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hola,</p>
                  <p style="color: #334155; font-size: 16px; line-height: 1.6;">A continuación, se detalla el reporte de higiene solicitado correspondiente a los registros en sistema:</p>
                  
                  ${registrosHigiene.length === 0 ? '<p style="text-align: center; color: #ef4444; font-weight: bold; margin: 30px 0;">No se encontraron registros para los filtros seleccionados.</p>' : ''}
                  
                  ${registrosHigiene.map((registro: any) => `
                    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; background-color: #f8fafc;">
                      <h3 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                        📅 Fecha: ${registro.fecha || '-'} | Transporte: ${registro.transporte || '-'}
                      </h3>
                      
                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 14px;">
                        <tr>
                          <td style="padding: 5px; color: #64748b;"><strong>Chofer:</strong> ${registro.chofer || '-'}</td>
                          <td style="padding: 5px; color: #64748b;"><strong>DNI:</strong> ${registro.dni_chofer || '-'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; color: #64748b;"><strong>Patente:</strong> ${registro.patente || '-'}</td>
                          <td style="padding: 5px; color: #64748b;"><strong>Cliente:</strong> ${registro.cliente || '-'}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding: 5px; color: #64748b;"><strong>Producto:</strong> ${registro.producto || '-'} (Lote: ${registro.n_lote || '-'})</td>
                        </tr>
                      </table>
                      
                      <h4 style="color: #334155; font-size: 15px; margin-bottom: 10px;">Checklist de Control:</h4>
                      <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 14px; color: #334155;">
                        <li style="padding: 5px 0;">
                          ${registro.chk_externa === 'Y' ? '✅' : '❌'} Higiene Externa (sin polvo/manchas)
                          ${registro.obs_externa && registro.obs_externa.toLowerCase() !== 'ninguna' && registro.obs_externa.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_externa}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_insectos === 'Y' ? '✅' : '❌'} Insectos Exterior
                          ${registro.obs_insectos && registro.obs_insectos.toLowerCase() !== 'ninguna' && registro.obs_insectos.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_insectos}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_film === 'Y' ? '✅' : '❌'} Tiene Film de polietileno
                          ${registro.obs_film && registro.obs_film.toLowerCase() !== 'ninguna' && registro.obs_film.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_film}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_humedad === 'Y' ? '✅' : '❌'} Mercadería seca sin humedad
                          ${registro.obs_humedad && registro.obs_humedad.toLowerCase() !== 'ninguna' && registro.obs_humedad.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_humedad}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_interior === 'Y' ? '✅' : '❌'} Transporte limpio y seco
                          ${registro.obs_interior && registro.obs_interior.toLowerCase() !== 'ninguna' && registro.obs_interior.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_interior}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_verificacion === 'Y' ? '✅' : '❌'} Transportista verificó bigbags/bolsas
                          ${registro.obs_verificacion && registro.obs_verificacion.toLowerCase() !== 'ninguna' && registro.obs_verificacion.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_verificacion}</span>` : ''}
                        </li>
                        <li style="padding: 5px 0;">
                          ${registro.chk_insecticida === 'Y' ? '✅' : '❌'} Aplicación de insecticida exterior
                          ${registro.obs_insecticida && registro.obs_insecticida.toLowerCase() !== 'ninguna' && registro.obs_insecticida.toLowerCase() !== 'null' ? `<br/><span style="color: #94a3b8; font-style: italic; font-size: 12px; margin-left: 25px;">Obs: ${registro.obs_insecticida}</span>` : ''}
                        </li>
                      </ul>
                      
                      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b;">
                        <strong>Inspector:</strong> ${registro.responsable_inspeccion || '-'} | <strong>Clima:</strong> ${registro.estado_clima || '-'}
                        ${registro.observaciones_generales ? `<br/><strong>Observaciones Generales:</strong> ${registro.observaciones_generales}` : ''}
                      </div>
                    </div>
                  `).join('')}
                  
                  <p style="color: #334155; font-size: 16px; margin-top: 30px;">Saludos cordiales,</p>
                  <p style="color: #4f46e5; font-weight: bold; font-size: 16px;">Equipo de Calidad - Paoloni</p>
                  
                  <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
                    Este es un correo generado automáticamente. Por favor no responder a este remitente.
                  </div>
                </div>
              </div>
            `;

            await mailService.enviarReporteConAdjunto(
              args.destinatario,
              args.asunto || 'Reporte de Higiene',
              htmlTemplateHigiene
            );

            return res.json({ response: `¡Listo! Acabo de enviar un reporte en formato HTML Premium de higiene a ${args.destinatario}.` });
        }
      }
    }

    const botReply = responseMessage?.text() || 'No pude generar una respuesta.';

    res.json({ response: botReply });
  } catch (error) {
    console.error('Error en AI Chat:', error);
    res.status(500).json({ error: 'Error interno del servidor en AI Chat.' });
  }
};
