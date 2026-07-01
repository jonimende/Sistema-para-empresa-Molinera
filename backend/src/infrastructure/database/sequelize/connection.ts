import { Sequelize } from 'sequelize';
import { initRole, Role } from './models/Role';
import { initUser, User } from './models/User';
import { initPermission, initRolePermission, Permission, RolePermission } from './models/Permission';
import { initChofer, Chofer } from './models/Chofer';
import { initVehiculo, Vehiculo } from './models/Vehiculo';
import { initProducto, Producto } from './models/Producto';
import { initViaje, Viaje } from './models/Viaje';
import { initCargaCombustible, CargaCombustible } from './models/CargaCombustible';
import { initElaboracionParte, ElaboracionParte } from './models/ElaboracionParte';
import { initProductoCarga, ProductoCarga } from './models/ProductoCarga';
import { initUbicacion, Ubicacion } from './models/Ubicacion';
import { initTurno, Turno } from './models/Turno';
import { initElaboracionCalidadTurno, ElaboracionCalidadTurno } from './models/ElaboracionCalidadTurno';
import { initNoConformidad, NoConformidad } from './models/NoConformidad';
import { initRecorridaDiaria, RecorridaDiaria } from './models/RecorridaDiaria';
import { initFotoRecorrida, FotoRecorrida } from './models/FotoRecorrida';
import { initControlCarga, ControlCarga } from './models/ControlCarga';
import { initServiceMantenimiento, ServiceMantenimiento } from './models/ServiceMantenimiento';
import { initAcoplado, Acoplado } from './models/Acoplado';
import { initLugarViaje, LugarViaje } from './models/LugarViaje';
import { initTipoCarga, TipoCarga } from './models/TipoCarga';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'erp_molino',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// Inicializar modelos
initRole(sequelize);
initUser(sequelize);
initPermission(sequelize);
initRolePermission(sequelize);
initChofer(sequelize);
initVehiculo(sequelize);
initProducto(sequelize);
initViaje(sequelize);
initCargaCombustible(sequelize);
initElaboracionParte(sequelize);
initProductoCarga(sequelize);
initUbicacion(sequelize);
initTurno(sequelize);
initElaboracionCalidadTurno(sequelize);
initNoConformidad(sequelize);
initRecorridaDiaria(sequelize);
initFotoRecorrida(sequelize);
initControlCarga(sequelize);
initServiceMantenimiento(sequelize);
initAcoplado(sequelize);
initLugarViaje(sequelize);
initTipoCarga(sequelize);

// Definir relaciones
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });


// Relaciones Eliminadas a favor de tipos STRING de AppSheet (patente_chasis y chofer_email)
// Vehiculo y Chofer conservan relacin entre s, pero sin afectar a los registros de Logstica.

// Vehiculo.belongsTo(Chofer, { foreignKey: 'chofer_asignado', as: 'chofer_asignado_rel' });
// Chofer.hasMany(Vehiculo, { foreignKey: 'chofer_asignado' });

// Relaciones 1:N Auditoría y Recorrida (Nueva Fase)
RecorridaDiaria.hasMany(FotoRecorrida, { foreignKey: 'recorrida_id', as: 'fotos' });
FotoRecorrida.belongsTo(RecorridaDiaria, { foreignKey: 'recorrida_id' });

// Diccionarios AppSheet para Viajes
Viaje.belongsTo(Ubicacion, { targetKey: 'id_appsheet', foreignKey: 'lugar_salida', as: 'Origen', constraints: false });
Viaje.belongsTo(Ubicacion, { targetKey: 'id_appsheet', foreignKey: 'lugar_llegada', as: 'Destino', constraints: false });
Viaje.belongsTo(ProductoCarga, { targetKey: 'id_appsheet', foreignKey: 'carga_transportada', as: 'Carga', constraints: false });

CargaCombustible.belongsTo(Vehiculo, { foreignKey: 'patente_chasis', targetKey: 'id_appsheet', as: 'CamionRel', constraints: false });
ServiceMantenimiento.belongsTo(Vehiculo, { foreignKey: 'patente_chasis', targetKey: 'id_appsheet', as: 'CamionRel', constraints: false });

// Relaciones Control de Carga (Multipunto) - Deshabilitadas por migración a formato plano
// ControlCarga.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
// ControlCarga.belongsTo(Chofer, { foreignKey: 'chofer_id', as: 'chofer' });
// ControlCarga.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
// ControlCarga.belongsTo(User, { foreignKey: 'inspector_id', as: 'inspector' });

export { sequelize };

ElaboracionParte.hasMany(ElaboracionCalidadTurno, { foreignKey: 'elaboracion_parte_id', as: 'controles' });
ElaboracionCalidadTurno.belongsTo(ElaboracionParte, { foreignKey: 'elaboracion_parte_id' });
