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
    res.status(200).json(await ElaboracionParte.findAll({ order: [['id', 'DESC']] }));
  } catch (error) {
    res.status(500).json({ message: 'Error interno', error });
  }
};

export const updateParteElaboracion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parte = await ElaboracionParte.findByPk(id);
    if (!parte) return res.status(404).json({ message: 'Parte no encontrado' });
    
    // Si hay que actualizar controles, lo ideal sería borrarlos y re-crearlos, 
    // o confiar en la DB si están embebidos. En este caso es JSONB para controles_calidad o paradas.
    // ElaboracionCalidadTurno (as 'controles') se maneja relacionalmente, pero si mandan data anidada,
    // actualizamos la tabla principal.
    await parte.update(req.body);
    res.status(200).json({ message: 'Parte actualizado', data: parte });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando', error });
  }
};

export const deleteParteElaboracion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parte = await ElaboracionParte.findByPk(id);
    if (!parte) return res.status(404).json({ message: 'Parte no encontrado' });
    
    await parte.destroy();
    res.status(200).json({ message: 'Parte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando', error });
  }
};
