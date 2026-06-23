import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CargaCombustible } from '../../database/sequelize/models/CargaCombustible';
import { Viaje } from '../../database/sequelize/models/Viaje';
import { Ubicacion } from '../../database/sequelize/models/Ubicacion';
import { ServiceMantenimiento } from '../../database/sequelize/models/ServiceMantenimiento';
import { Vehiculo } from '../../database/sequelize/models/Vehiculo';
import { PdfReportService } from '../../../core/application/services/PdfReportService';
import { Acoplado } from '../../database/sequelize/models/Acoplado';

const pdfService = new PdfReportService();

export const registrarCarga = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const nuevaCarga = await CargaCombustible.create(data);
    res.status(201).json(nuevaCarga);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar carga', error });
  }
};

export const descargarReporte = async (req: Request, res: Response) => {
  try {
    const { vehiculo_id } = req.params;
    const buffer = await pdfService.generarReporteConsumo(Number(vehiculo_id));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_vehiculo_${vehiculo_id}.pdf`);
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF', error });
  }
};

// HELPER PARA RESOLVER MODELO
const getModel = (path: string) => {
  if (path.includes('/viajes')) return Viaje;
  if (path.includes('/combustible')) return CargaCombustible;
  if (path.includes('/service')) return ServiceMantenimiento;
  if (path.includes('/camiones')) return Vehiculo;
  if (path.includes('/nc') || path.includes('/no-conformidades')) return require('../../database/sequelize/models/NoConformidad').NoConformidad;
  if (path.includes('/recorridas')) return require('../../database/sequelize/models/RecorridaDiaria').RecorridaDiaria;
  if (path.includes('/higiene-carga')) return require('../../database/sequelize/models/ControlCarga').ControlCarga;
  if (path.includes('/choferes')) return require('../../database/sequelize/models/Chofer').Chofer;
  if (path.includes('/productos')) return require('../../database/sequelize/models/ProductoCarga').ProductoCarga;
  if (path.includes('/turnos')) return require('../../database/sequelize/models/Turno').Turno;
  if (path.includes('/acoplados')) return require('../../database/sequelize/models/Acoplado').Acoplado;
  return null;
};

// GET específicos con Eager Loading para diccionarios
export const getCombustible = async (req: Request, res: Response) => {
  try {
    let whereClause: any = {};
    const user = (req as any).user;
    
    if (user) {
      const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
      const isCamionero = String(user.role || user.rol).toLowerCase() === 'camionero';
      
      if (isCamionero) {
        if (CargaCombustible.rawAttributes && CargaCombustible.rawAttributes.chofer_email) {
          whereClause.chofer_email = emailSeguro;
        } else if (CargaCombustible.rawAttributes && CargaCombustible.rawAttributes.chofer) {
          whereClause.chofer = emailSeguro;
        }
      }
    }

    const records = await CargaCombustible.findAll({
      where: whereClause,
      include: [{ model: Vehiculo, as: 'CamionRel', attributes: ['patente_chasis', 'marca', 'modelo'] }],
      order: [[CargaCombustible.primaryKeyAttribute || 'id', 'DESC']]
    });
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    let whereClause: any = {};
    const user = (req as any).user;
    
    if (user) {
      const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
      const isCamionero = String(user.role || user.rol).toLowerCase() === 'camionero';
      
      if (isCamionero) {
        if (ServiceMantenimiento.rawAttributes && ServiceMantenimiento.rawAttributes.chofer_email) {
          whereClause.chofer_email = emailSeguro;
        } else if (ServiceMantenimiento.rawAttributes && ServiceMantenimiento.rawAttributes.chofer) {
          whereClause.chofer = emailSeguro;
        }
      }
    }

    const records = await ServiceMantenimiento.findAll({
      where: whereClause,
      include: [{ model: Vehiculo, as: 'CamionRel', attributes: ['patente_chasis', 'marca', 'modelo'] }],
      order: [[ServiceMantenimiento.primaryKeyAttribute || 'id', 'DESC']]
    });
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
};

export const resetAcopladosDB = async (req: Request, res: Response) => {
  try {
    await Acoplado.sync({ force: true });
    res.status(200).json({ message: 'Tabla acoplados reseteada con exito (DROP & CREATE).' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error reseteando DB: ' + error.message });
  }
};

// CRUD GENÉRICO REAL
export const genericGetAll = async (req: Request, res: Response) => {
  try {
    const Model = getModel(req.path);
    if (!Model) return res.status(404).json({ error: 'Ruta no válida' });
    
    let whereClause: any = {};
    const user = (req as any).user;
    
    console.log('--- DEBUG TOKEN USUARIO ---');
    console.log(user);
    console.log('---------------------------');

    if (user) {
      const isCamionero = String(user.role || user.rol).toLowerCase() === 'camionero';
      if (isCamionero) {
        const pathStr = req.path.toLowerCase();
        const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
        
        const cols = Object.keys(Model.rawAttributes);
        console.log(`[RLS DEBUG] Ruta: ${pathStr} | Email: ${emailSeguro}`);

        if (pathStr.includes('/viajes')) {
          console.log(`[RLS VIAJES] Columnas de Viaje:`, cols.join(', '));
          if (cols.includes('chofer_email')) whereClause.chofer_email = emailSeguro;
          else if (cols.includes('chofer')) whereClause.chofer = emailSeguro;
        } else if (pathStr.includes('/combustible') || pathStr.includes('/service')) {
          if (cols.includes('chofer_email')) whereClause.chofer_email = emailSeguro;
        }
      }
    }

    const primaryKey = Model.primaryKeyAttribute || 'id';
    const records = await Model.findAll({ where: whereClause, order: [[primaryKey, 'DESC']] });
    res.status(200).json(records);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El registro ya existe. Verifique los datos (Ej: patente duplicada).' });
    }
    res.status(500).json({ error: 'Error interno' });
  }
};

export const genericGetOne = async (req: Request, res: Response) => {
  try {
    const Model = getModel(req.path);
    if (!Model) return res.status(404).json({ error: 'Ruta no válida' });
    
    let record;
    if (isNaN(Number(req.params.id)) && Model.rawAttributes.id_appsheet) {
      record = await Model.findOne({ where: { id_appsheet: req.params.id } });
    } else {
      record = await Model.findByPk(req.params.id);
    }
    
    if (!record) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json(record);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El registro ya existe. Verifique los datos (Ej: patente duplicada).' });
    }
    res.status(500).json({ error: 'Error interno' });
  }
};

export const genericCreate = async (req: Request, res: Response) => {
  try {
    const Model = getModel(req.path);
    if (!Model) return res.status(404).json({ error: 'Ruta no válida' });
    
    const user = (req as any).user;
    if (user) {
      const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
      const isCamionero = String(user.role || user.rol).toLowerCase() === 'camionero';
      
      if (isCamionero) {
        if (Model.rawAttributes.chofer_email) {
          req.body.chofer_email = emailSeguro;
        } else if (Model.rawAttributes.chofer) {
          req.body.chofer = emailSeguro;
        }
      }
    }
    
    // Scrubbing de basura del FormData
    Object.keys(req.body).forEach(key => {
      const val = req.body[key];
      if (val === 'null' || val === 'undefined' || val === '') {
        delete req.body[key]; // Si lo borramos, Sequelize no lo actualiza y conserva el dato original de la DB
      }
    });
    
    // Procesar archivos interceptados por multer.any()
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        req.body[file.fieldname] = `/uploads/no-conformidades/${file.filename}`;
      });
    }

    if (req.path.includes('/combustible') && req.body.patente_chasis) {
      let wherePrevious: any = { patente_chasis: req.body.patente_chasis };
      
      const user = (req as any).user;
      if (user && String(user.role || user.rol).toLowerCase() === 'camionero') {
        const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
        if (Model.rawAttributes.chofer_email) {
          wherePrevious.chofer_email = emailSeguro;
        } else if (Model.rawAttributes.chofer) {
          wherePrevious.chofer = emailSeguro;
        }
      }

      const previous = await Model.findOne({
        where: wherePrevious, // <-- Usamos el filtro dinámico y aislado
        order: [['kilometraje', 'DESC']]
      });

      if (previous && req.body.kilometraje > previous.kilometraje) {
        const diffKm = req.body.kilometraje - previous.kilometraje;
        req.body.consumo_l_100km = parseFloat(((req.body.litros_gasoil * 100) / diffKm).toFixed(2));
      } else {
        req.body.consumo_l_100km = 0;
      }
    }
    if (req.path.includes('/viajes')) {
      if (req.body.chofer) req.body.chofer_email = req.body.chofer;
      if (req.body.camion) req.body.patente_chasis = req.body.camion;
      
      // NUEVAS LÍNEAS DE FIX:
      if (!req.body.hora_salida) req.body.hora_salida = '00:00';
      if (!req.body.hora_llegada) req.body.hora_llegada = '00:00';

      const generateAppSheetId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

        if (req.body.lugar_salida) {
          const [origen] = await Ubicacion.findOrCreate({ 
            where: { nombre_lugar: req.body.lugar_salida },
            defaults: { id_appsheet: generateAppSheetId() }
          });
          // CRÍTICO: Conservamos el texto para evitar el notNull Violation
          req.body.lugar_salida = (origen as any).dataValues?.nombre_lugar || req.body.lugar_salida;
          // Opcional: si existe una llave foránea real, la inyectamos
          if ((origen as any).dataValues?.id) req.body.origen_id = (origen as any).dataValues.id; 
        }
        
        if (req.body.lugar_llegada) {
          const [destino] = await Ubicacion.findOrCreate({ 
            where: { nombre_lugar: req.body.lugar_llegada },
            defaults: { id_appsheet: generateAppSheetId() }
          });
          req.body.lugar_llegada = (destino as any).dataValues?.nombre_lugar || req.body.lugar_llegada;
          if ((destino as any).dataValues?.id) req.body.destino_id = (destino as any).dataValues.id;
        }
    }
    const newRecord = await Model.create(req.body);
    res.status(201).json(newRecord);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El registro ya existe. Verifique los datos (Ej: patente duplicada).' });
    }
    res.status(500).json({ error: 'Error interno' });
  }
};

export const genericUpdate = async (req: Request, res: Response) => {
  try {
    const Model = getModel(req.path);
    if (!Model) return res.status(404).json({ error: 'Ruta no válida' });
    
    // Scrubbing de basura del FormData
    Object.keys(req.body).forEach(key => {
      const val = req.body[key];
      if (val === 'null' || val === 'undefined' || val === '') {
        delete req.body[key]; // Si lo borramos, Sequelize no lo actualiza y conserva el dato original de la DB
      }
      
      // Manejar eliminación explícita de campos (ej: delete_foto_1)
      if (key.startsWith('delete_') && req.body[key] === 'true') {
        const fieldName = key.replace('delete_', '');
        req.body[fieldName] = null;
        delete req.body[key];
      }
    });
    
    // Procesar archivos interceptados por multer.any()
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        req.body[file.fieldname] = `/uploads/no-conformidades/${file.filename}`;
      });
    }
    
    let record;
    if (isNaN(Number(req.params.id)) && Model.rawAttributes.id_appsheet) {
      record = await Model.findOne({ where: { id_appsheet: req.params.id } });
    } else {
      record = await Model.findByPk(req.params.id);
    }
    
    if (!record) return res.status(404).json({ error: 'No encontrado' });
    if (req.path.includes('/combustible') && req.body.patente_chasis) {
      let wherePrevious: any = { 
        patente_chasis: req.body.patente_chasis,
        kilometraje: { [require('sequelize').Op.lt]: req.body.kilometraje }
      };
      
      const user = (req as any).user;
      if (user && String(user.role || user.rol).toLowerCase() === 'camionero') {
        const emailSeguro = user.email || user.correo || user.username || 'SIN_EMAIL';
        if (Model.rawAttributes.chofer_email) {
          wherePrevious.chofer_email = emailSeguro;
        } else if (Model.rawAttributes.chofer) {
          wherePrevious.chofer = emailSeguro;
        }
      }

      const previous = await Model.findOne({
        where: wherePrevious, // <-- Usamos el filtro dinámico y aislado
        order: [['kilometraje', 'DESC']]
      });

      if (previous) {
        const diffKm = req.body.kilometraje - previous.kilometraje;
        req.body.consumo_l_100km = parseFloat(((req.body.litros_gasoil * 100) / diffKm).toFixed(2));
      } else {
        req.body.consumo_l_100km = 0;
      }
    }
    if (req.path.includes('/viajes')) {
      if (req.body.chofer) req.body.chofer_email = req.body.chofer;
      if (req.body.camion) req.body.patente_chasis = req.body.camion;
      
      // NUEVAS LÍNEAS DE FIX:
      if (!req.body.hora_salida) req.body.hora_salida = '00:00';
      if (!req.body.hora_llegada) req.body.hora_llegada = '00:00';
    }
    
    // Evitar sobreescribir fotos si no se subió una nueva
    if (!req.file && (!req.files || (Array.isArray(req.files) && req.files.length === 0))) {
      delete req.body.foto;
      delete req.body.foto_url;
      delete req.body.evidencia; 
      delete req.body.evidencia_fotografica;
    } else if (req.file) { 
      // 1. Borrar la foto vieja si existía
      const fotoVieja = record.foto || record.foto_url || record.evidencia;
      if (fotoVieja) {
        // En caso de que la ruta comience con '/', la quitamos para poder usar join correctamente con process.cwd() si es necesario, 
        // o si es relativa. Dependerá de cómo se guardó. Asumimos que process.cwd() apunta a la raíz del proyecto.
        const oldPath = path.join(process.cwd(), fotoVieja);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      // 2. Guardar estrictamente la ruta web relativa
      const webPath = '/uploads/no-conformidades/' + req.file.filename;
      req.body.foto = webPath;
      req.body.foto_url = webPath;
      req.body.evidencia = webPath;
    }

    await record.update(req.body);
    res.status(200).json(record);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El registro ya existe. Verifique los datos (Ej: patente duplicada).' });
    }
    res.status(500).json({ error: 'Error interno' });
  }
};

export const genericDelete = async (req: Request, res: Response) => {
  try {
    const Model = getModel(req.path);
    if (!Model) return res.status(404).json({ error: 'Ruta no válida' });
    
    let record;
    if (isNaN(Number(req.params.id)) && Model.rawAttributes.id_appsheet) {
      record = await Model.findOne({ where: { id_appsheet: req.params.id } });
    } else {
      record = await Model.findByPk(req.params.id);
    }
    
    if (!record) return res.status(404).json({ error: 'No encontrado' });
    await record.destroy();
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error: any) {
    console.error('ERROR AL ELIMINAR:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El registro ya existe. Verifique los datos (Ej: patente duplicada).' });
    }
    res.status(500).json({ error: 'Error interno al eliminar el registro. Revise si hay dependencias o claves foráneas que lo estén bloqueando.' });
  }
};
