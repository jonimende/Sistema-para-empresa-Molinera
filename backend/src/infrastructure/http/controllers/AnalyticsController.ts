import { Request, Response } from 'express';
import { NoConformidad } from '../../database/sequelize/models/NoConformidad';
import { ElaboracionParte } from '../../database/sequelize/models/ElaboracionParte';
import { CargaCombustible } from '../../database/sequelize/models/CargaCombustible';
import { AiReportService } from '../../../core/application/services/AiReportService';
import { Op } from 'sequelize';

export const getKpis = async (req: Request, res: Response) => {
  try {
    // Extraer todas las partes de producción (lo ideal sería agrupar por mes en SQL puro, pero para este mock resolvemos en RAM)
    const partes = await ElaboracionParte.findAll();
    const produccion_total = partes.reduce((acc, p) => 
      acc + (Number((p as any).kilos_salida) || 0), 0);
    
    // Sumar litros de combustible de logística
    const cargas = await CargaCombustible.findAll();
    const litros_combustible = cargas.reduce((acc, c) => acc + (Number(c.litros_gasoil) || 0), 0);
    
    // Indicadores clave de Calidad
    const nc_abiertas = await NoConformidad.count({ where: { estado: { [Op.in]: ['Pendiente', 'En Tratamiento'] } } });
    const nc_criticas = await NoConformidad.count({ where: { gravedad: 'Crítica' } });
    
    // Array para el Chart.js de Torta en Frontend
    const nc_estados = [
      await NoConformidad.count({ where: { estado: 'Pendiente' } }),
      await NoConformidad.count({ where: { estado: 'En Tratamiento' } }),
      await NoConformidad.count({ where: { estado: 'Cerrada' } })
    ];

    res.json({
      produccion_total,
      litros_combustible,
      nc_abiertas,
      nc_criticas,
      nc_estados
    });
  } catch (error) {
    console.error('Error calculando KPIs:', error);
    res.status(500).json({ message: 'Error interno obteniendo KPIs' });
  }
};

export const dispararReporteIA = async (req: Request, res: Response) => {
  try {
    const kpis = req.body.kpis; 
    // Llamada asíncrona al servicio pesado
    const success = await AiReportService.generarYEnviarReporteIA(kpis);
    
    if(success) {
      res.status(200).json({ message: 'El reporte fue generado y despachado por correo a Gerencia.' });
    } else {
      res.status(500).json({ message: 'Error en el motor de renderizado o servidor SMTP.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno de red' });
  }
};
