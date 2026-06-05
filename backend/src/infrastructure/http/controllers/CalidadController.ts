import { Request, Response } from 'express';
import { NoConformidad } from '../../database/sequelize/models/NoConformidad';
import { ControlCarga } from '../../database/sequelize/models/ControlCarga';

export const reportarNC = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Si multer procesó una imagen, almacenamos la URL pública
    if (req.file) {
      data.foto_url = `/uploads/no-conformidades/${req.file.filename}`;
    }

    const nuevaNC = await NoConformidad.create(data);
    
    res.status(201).json({
      message: 'No Conformidad registrada con éxito',
      data: nuevaNC
    });
  } catch (error) {
    console.error('Error reportando NC:', error);
    res.status(500).json({ message: 'Error interno del servidor al guardar la NC.', error });
  }
};

export const listarNCs = async (req: Request, res: Response) => {
  try {
    // Obtenemos todas las No Conformidades, ordenadas por la más reciente
    const ncs = await NoConformidad.findAll({ order: [['fecha_reporte', 'DESC']] });
    res.json(ncs);
  } catch (error) {
    console.error('Error listando NCs:', error);
    res.status(500).json({ message: 'Error obteniendo la lista de No Conformidades.', error });
  }
};

export const registrarHigieneCarga = async (req: Request, res: Response) => {
  try {
    const nuevaHigiene = await ControlCarga.create(req.body);
    
    res.status(201).json({
      message: 'Control de Higiene de Carga registrado con éxito',
      data: nuevaHigiene
    });
  } catch (error) {
    console.error('Error reportando Higiene PCC:', error);
    res.status(500).json({ message: 'Error interno del servidor al guardar Higiene.', error });
  }
};

export const listarHigieneCarga = async (req: Request, res: Response) => {
  try {
    const records = await ControlCarga.findAll({ order: [['id', 'DESC']] });
    res.json(records);
  } catch (error) {
    console.error('Error listando Higiene PCC:', error);
    res.status(500).json({ message: 'Error interno del servidor al listar Higiene.', error });
  }
};
