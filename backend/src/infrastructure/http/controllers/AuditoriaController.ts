import { Request, Response } from 'express';
import { sequelize } from '../../database/sequelize/connection';
import { RecorridaDiaria } from '../../database/sequelize/models/RecorridaDiaria';
import { FotoRecorrida } from '../../database/sequelize/models/FotoRecorrida';

export const registrarRecorrida = async (req: Request, res: Response) => {
  // Inicializamos una Transacción SQL para asegurar atomicidad
  const t = await sequelize.transaction();

  try {
    const data = req.body;
    
    // 1. Guardar Cabecera de la Auditoría
    const nuevaRecorrida = await RecorridaDiaria.create(data, { transaction: t });
    
    // 2. Comprobar e iterar sobre los múltiples archivos interceptados por Multer
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      
      // Mapeamos los archivos y preparamos el array para el Bulk Insert
      const fotosData = files.map((file) => ({
        recorrida_id: nuevaRecorrida.id, // Enlazamos a la Cabecera recién creada
        foto_url: `/uploads/no-conformidades/${file.filename}`, // Usamos la misma carpeta pública
        detalle: '' // (Opcional, podrías parsearlo si envías metadatos en array)
      }));
      
      // 3. Inserción Masiva ultra rápida de todas las fotografías, envuelta en la transacción
      await FotoRecorrida.bulkCreate(fotosData, { transaction: t });
    }

    // 4. Si todo salió a la perfección, hacemos COMMIT en PostgreSQL
    await t.commit();

    res.status(201).json({
      message: 'Recorrida Diaria y sus evidencias fotográficas registradas con éxito.',
      data: nuevaRecorrida
    });
  } catch (error) {
    // Si la cabecera O ALGUN archivo falla, hacemos ROLLBACK para anular todo el proceso
    await t.rollback();
    console.error('Error registrando auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor, transacción revertida y anulada.', error });
  }
};
