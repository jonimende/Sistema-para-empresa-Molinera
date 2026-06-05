import { Request, Response } from 'express';
import { User } from '../../database/sequelize/models/User';
import { Viaje } from '../../database/sequelize/models/Viaje';
import { RecorridaDiaria } from '../../database/sequelize/models/RecorridaDiaria';
import { CargaCombustible } from '../../database/sequelize/models/CargaCombustible';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // 1. Estadísticas Generales (Promise.all para ejecución en paralelo)
    const [totalUsuarios, totalViajes, totalRecorridas] = await Promise.all([
      User.count(),
      Viaje.count(),
      RecorridaDiaria.count()
    ]);

    // 2. Actividad Reciente
    // Últimos 5 Viajes
    const ultimosViajes = await Viaje.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      raw: true
    });

    // Últimas 5 Cargas de Combustible
    const ultimasCargas = await CargaCombustible.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      raw: true
    });

    // Mapeo a un arreglo unificado de notificaciones
    const actividadViajes = ultimosViajes.map((v: any) => ({
      tipo: 'Viaje',
      mensaje: `Nuevo viaje registrado (Chofer: ${v.chofer_email || v.chofer || 'Desconocido'})`,
      fecha: v.createdAt || v.fecha_salida || new Date()
    }));

    const actividadCargas = ultimasCargas.map((c: any) => ({
      tipo: 'Combustible',
      mensaje: `Carga de combustible (Patente: ${c.patente_chasis})`,
      fecha: c.createdAt || c.fecha || new Date()
    }));

    // Combinar, ordenar por fecha descendente y tomar los primeros 5
    const actividadReciente = [...actividadViajes, ...actividadCargas]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

    // Respuesta Final
    res.json({
      stats: {
        totalUsuarios,
        totalViajes,
        totalRecorridas
      },
      actividadReciente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener datos del dashboard' });
  }
};
