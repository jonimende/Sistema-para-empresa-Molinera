import { Request, Response } from 'express';
import { ElaboracionParte } from '../../database/sequelize/models/ElaboracionParte';
import { ElaboracionCalidadTurno } from '../../database/sequelize/models/ElaboracionCalidadTurno';

export const crearParteElaboracion = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Sequelize crea el parte y sus hijos automáticamente si se define el alias
    const parte = await ElaboracionParte.create(data, {
      include: [{ model: ElaboracionCalidadTurno, as: 'controles' }]
    });
    
    res.status(201).json({
      message: 'Parte de elaboración registrado exitosamente.',
      data: parte
    });
  } catch (error) {
    console.error('Error registrando parte de elaboración:', error);
    res.status(500).json({ message: 'Error interno del servidor al procesar el parte.', error });
  }
};

export const getPartesElaboracion = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await ElaboracionParte.findAll());
  } catch (error) {
    res.status(500).json({ message: 'Error interno', error });
  }
};
