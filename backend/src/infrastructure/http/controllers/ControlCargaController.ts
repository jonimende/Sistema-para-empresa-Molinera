import { Request, Response } from 'express';
import { ControlCarga } from '../../database/sequelize/models/ControlCarga';
import { Vehiculo } from '../../database/sequelize/models/Vehiculo';
import { Chofer } from '../../database/sequelize/models/Chofer';
import { Producto } from '../../database/sequelize/models/Producto';

export const registrarControlCarga = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Si no se especifica el ID del inspector en el frontend, seteamos 1 por defecto (admin temporalmente)
    data.inspector_id = data.inspector_id || 1; 

    const nuevoControl = await ControlCarga.create(data);
    res.status(201).json({ message: 'Control de Carga registrado con éxito.', data: nuevoControl });
  } catch (error) {
    console.error('Error registrando Control Carga:', error);
    res.status(500).json({ message: 'Error interno guardando el Control de Higiene', error });
  }
};

export const obtenerCatalogosWizard = async (req: Request, res: Response) => {
  try {
    // Para el Paso 1 del Wizard: enviar todas las FK de golpe
    // Evitamos al Frontend hacer múltiples llamadas HTTP innecesarias
    const vehiculos = await Vehiculo.findAll({ attributes: ['id', 'patente_chasis'] });
    const choferes = await Chofer.findAll({ attributes: ['id', 'nombre_y_apellido'] });
    const productos = await Producto.findAll({ attributes: ['id', 'nombre'] }); // asumiendo 'nombre'
    
    res.json({ vehiculos, choferes, productos });
  } catch (error) {
    console.error('Error obteniendo catalogos:', error);
    res.status(500).json({ message: 'Error recuperando catalogos' });
  }
};
