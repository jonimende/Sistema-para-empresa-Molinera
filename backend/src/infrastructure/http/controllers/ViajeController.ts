import { Response } from 'express';
import { AuthRequest } from '../middlewares/authGuard';
import { Viaje } from '../../database/sequelize/models/Viaje';
import { Ubicacion } from '../../database/sequelize/models/Ubicacion';
import { ProductoCarga } from '../../database/sequelize/models/ProductoCarga';

export const getViajes = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const whereClause: any = {};

    // Normalizamos el rol para que atrape tanto 'Camionero' como 'Chofer'
    const isCamionero = String(user.role || '').toLowerCase() === 'camionero' || String(user.role || '').toLowerCase() === 'chofer';

    if (isCamionero) {
      const u = user as any;
      const emailSeguro = u.email || u.correo || u.username || 'SIN_EMAIL';
      
      // Usamos el modelo Viaje para detectar la columna correcta
      if (Viaje.rawAttributes.chofer_email) {
        whereClause.chofer_email = emailSeguro;
      } else if (Viaje.rawAttributes.chofer) {
        whereClause.chofer = emailSeguro;
      }
    }

    // Si es Administrador o Logística, no entra al IF y whereClause queda vacío (ven todo)

    const viajes = await Viaje.findAll({ 
      where: whereClause,
      raw: true,
      nest: true,
      include: [
        { model: Ubicacion, as: 'Origen', attributes: ['nombre_lugar'] },
        { model: Ubicacion, as: 'Destino', attributes: ['nombre_lugar'] },
        { model: ProductoCarga, as: 'Carga', attributes: ['nombre_carga'] }
      ],
      order: [['id', 'DESC']]
    });
    res.json(viajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving viajes' });
  }
};
