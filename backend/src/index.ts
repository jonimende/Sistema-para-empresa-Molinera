import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './infrastructure/database/sequelize/connection';
import { Role } from './infrastructure/database/sequelize/models/Role';
import { User } from './infrastructure/database/sequelize/models/User';
import bcrypt from 'bcrypt';
import { login } from './infrastructure/http/controllers/AuthController';
import { getViajes } from './infrastructure/http/controllers/ViajeController';
import { registrarCarga, descargarReporte, genericGetAll, genericGetOne, genericCreate, genericUpdate, genericDelete, getCombustible, getService } from './infrastructure/http/controllers/LogisticaController';
import { crearParteElaboracion, getPartesElaboracion } from './infrastructure/http/controllers/ElaboracionController';
import { reportarNC, listarNCs, registrarHigieneCarga, listarHigieneCarga } from './infrastructure/http/controllers/CalidadController';
import { registrarRecorrida } from './infrastructure/http/controllers/AuditoriaController';
import { registrarControlCarga, obtenerCatalogosWizard } from './infrastructure/http/controllers/ControlCargaController';
import { getKpis, dispararReporteIA } from './infrastructure/http/controllers/AnalyticsController';
import { handleChat } from './infrastructure/http/controllers/AiController';
import { authGuard } from './infrastructure/http/middlewares/authGuard';
import { roleGuard } from './infrastructure/http/middlewares/roleGuard';
import { uploadMiddleware } from './infrastructure/http/middlewares/uploadMiddleware';
import usuarioRoutes from './infrastructure/http/routes/usuario.routes';
import dashboardRoutes from './infrastructure/http/routes/dashboard.routes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://sistema-para-empresa-molinera.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Exponer la carpeta de uploads para ser consumida como archivos estáticos por el Frontend
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas Públicas
app.post('/api/auth/login', login);

// Rutas de Dashboard y Usuarios
app.use('/api/usuarios', authGuard, roleGuard(['Admin']), usuarioRoutes);
app.use('/api/dashboard', authGuard, dashboardRoutes);

// Rutas Protegidas (Ejemplo Viajes)
app.get('/api/viajes', authGuard, roleGuard(['ver_viajes']), getViajes);

// Rutas Módulo Logística
app.post('/api/logistica/cargas', authGuard, registrarCarga);
app.get('/api/logistica/vehiculos/:vehiculo_id/reporte', authGuard, descargarReporte);

// Rutas CRUD Logística (Viajes, Combustible y Service manejan su propio GET)
app.get('/api/logistica/viajes', authGuard, getViajes);
app.get('/api/logistica/combustible', authGuard, getCombustible);
app.get('/api/logistica/service', authGuard, getService);

['viajes', 'combustible', 'service', 'camiones', 'choferes', 'productos_carga', 'turnos'].forEach(entity => {
  if (!['viajes', 'combustible', 'service'].includes(entity)) {
    app.get(`/api/logistica/${entity}`, authGuard, genericGetAll);
  }
  app.get(`/api/logistica/${entity}/:id`, authGuard, genericGetOne);
  app.post(`/api/logistica/${entity}`, authGuard, uploadMiddleware.any(), genericCreate);
  app.put(`/api/logistica/${entity}/:id`, authGuard, uploadMiddleware.any(), genericUpdate);
  app.delete(`/api/logistica/${entity}/:id`, authGuard, genericDelete);
});


// Rutas CRUD Dinámicas Producción
['productos', 'turnos'].forEach(entity => {
  app.get(`/api/produccion/${entity}`, authGuard, genericGetAll);
  app.post(`/api/produccion/${entity}`, authGuard, genericCreate);
});

// Rutas Módulo Producción/Elaboración
app.post('/api/produccion/partes', authGuard, roleGuard(['Admin', 'Molinero']), crearParteElaboracion);
app.get('/api/produccion/partes', authGuard, roleGuard(['Admin', 'Molinero']), getPartesElaboracion);

// Rutas Módulo Calidad
app.post('/api/calidad/no-conformidades', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), uploadMiddleware.single('foto'), reportarNC);
app.get('/api/calidad/no-conformidades', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'Mantenimiento', 'Logistica', 'Molinero', 'No_Conformidades']), listarNCs);

// Alias /nc para Calidad (GET, POST, PUT, DELETE)
app.get('/api/calidad/nc', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'Mantenimiento', 'Logistica', 'Molinero', 'No_Conformidades']), listarNCs);
app.post('/api/calidad/nc', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'No_Conformidades']), uploadMiddleware.single('foto'), reportarNC);
app.put('/api/calidad/nc/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'No_Conformidades']), uploadMiddleware.single('foto'), genericUpdate);
app.delete('/api/calidad/nc/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'No_Conformidades']), genericDelete);

app.post('/api/calidad/higiene-carga', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), uploadMiddleware.any(), registrarHigieneCarga);
app.get('/api/calidad/higiene-carga', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), listarHigieneCarga);
app.put('/api/calidad/higiene-carga/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), uploadMiddleware.any(), genericUpdate);
app.delete('/api/calidad/higiene-carga/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), genericDelete);

// Rutas Módulo Auditoría
app.post('/api/auditoria/recorridas', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), uploadMiddleware.array('fotos_recorrida', 10), registrarRecorrida);

// Rutas AI Global
app.post('/api/ai/chat', authGuard, handleChat);

app.get('/api/auditoria/recorridas', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), async (req, res) => { 
  try {
    const { RecorridaDiaria } = require('./infrastructure/database/sequelize/models/RecorridaDiaria');
    const records = await RecorridaDiaria.findAll({ order: [['id', 'DESC']] });
    res.json(records);
  } catch (error) {
    res.json([]);
  }
});
app.put('/api/auditoria/recorridas/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), uploadMiddleware.any(), genericUpdate);
app.delete('/api/auditoria/recorridas/:id', authGuard, roleGuard(['Admin', 'Inspector_Calidad']), genericDelete);


// Rutas Módulo Control de Carga (Integrador Wizard)
app.get('/api/control-carga/catalogos', authGuard, obtenerCatalogosWizard);
app.post('/api/control-carga', authGuard, roleGuard(['Admin', 'Inspector_Calidad', 'Logistica']), registrarControlCarga);

// Rutas Dashboard y Reportes IA (Exclusivo Admin por seguridad)
app.get('/api/analytics/kpis', authGuard, roleGuard(['Admin']), getKpis);
app.post('/api/analytics/reporte-ia', authGuard, roleGuard(['Admin']), dispararReporteIA);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos (En prod usar migraciones)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // --- SEEDER AUTOMÁTICO (ADMIN REQUERIDO) ---
    async function runSeeder() {
      try {
        // 1. Asegurar que el rol Admin exista
        const [adminRole] = await Role.findOrCreate({
          where: { name: 'Admin' },
          defaults: { name: 'Admin', description: 'Administrador Supremo del Sistema' } as any
        });

        // FIX: Extraer el ID crudo directo del dataValues de Sequelize
        const roleId = adminRole.getDataValue('id');

        // 2. Asegurar que el usuario exista
        const userEmail = 'admin@paoloni.com';
        const existingUser = await User.findOne({ where: { email: userEmail } });

        if (!existingUser) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('admin123', salt);
          
          await User.create({
            username: 'Administrador Gerencial',
            email: userEmail,
            passwordHash: hashedPassword,
            role_id: roleId,
            is_active: true
          });
          console.log('👑 Usuario Admin por defecto inyectado con éxito.');
        } else {
          console.log('ℹ️ [SEEDER] El usuario admin ya existía en la base de datos.');
        }
      } catch (error) {
        console.error('Error in seeder:', error);
      }
    }

    await runSeeder();
    // -------------------------------------------

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
