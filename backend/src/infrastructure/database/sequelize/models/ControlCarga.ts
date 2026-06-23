import { Model, DataTypes, Sequelize } from 'sequelize';

export class ControlCarga extends Model {
  public declare id: number;
  
  // Cabecera
  public declare fecha: string;
  public declare transporte: string;
  public declare chofer: string;
  public declare cliente: string;
  public declare producto: string;
  public declare patente: string;
  public declare habilitacion_transporte: string;
  public declare dni_chofer: string;
  public declare cma: string;
  public declare tipo_envase: string;
  public declare n_lote: string;
  
  // Checklist
  public declare chk_externa: string;
  public declare chk_insectos: string;
  public declare chk_film: string;
  public declare chk_humedad: string;
  public declare chk_interior: string;
  public declare chk_verificacion: string;
  public declare chk_insecticida: string;
  
  // Observaciones
  public declare obs_externa: string;
  public declare obs_insectos: string;
  public declare obs_film: string;
  public declare obs_humedad: string;
  public declare obs_interior: string;
  public declare obs_verificacion: string;
  public declare obs_insecticida: string;

  // Cierre y Firmas
  public declare estado_clima: string;
  public declare observaciones_generales: string;
  public declare responsable_inspeccion: string;
  public declare firma_inspector: string;
  public declare firma_chofer: string;

  // Fotografías (Evidencia) - Paths / URLs
  public declare foto_1: string;
  public declare foto_2: string;
  public declare foto_3: string;
  public declare foto_4: string;
  public declare foto_5: string;
  public declare foto_6: string;
}

export const initControlCarga = (sequelize: Sequelize) => {
  ControlCarga.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    
    // Cabecera
    fecha: { type: DataTypes.STRING, allowNull: true },
    transporte: { type: DataTypes.STRING, allowNull: true },
    chofer: { type: DataTypes.STRING, allowNull: true },
    cliente: { type: DataTypes.STRING, allowNull: true },
    producto: { type: DataTypes.STRING, allowNull: true },
    patente: { type: DataTypes.STRING, allowNull: true },
    habilitacion_transporte: { type: DataTypes.STRING, allowNull: true },
    dni_chofer: { type: DataTypes.STRING, allowNull: true },
    cma: { type: DataTypes.STRING, allowNull: true },
    tipo_envase: { type: DataTypes.STRING, allowNull: true },
    n_lote: { type: DataTypes.STRING, allowNull: true },
    
    // Checklist
    chk_externa: { type: DataTypes.STRING, allowNull: true },
    chk_insectos: { type: DataTypes.STRING, allowNull: true },
    chk_film: { type: DataTypes.STRING, allowNull: true },
    chk_humedad: { type: DataTypes.STRING, allowNull: true },
    chk_interior: { type: DataTypes.STRING, allowNull: true },
    chk_verificacion: { type: DataTypes.STRING, allowNull: true },
    chk_insecticida: { type: DataTypes.STRING, allowNull: true },

    // Observaciones
    obs_externa: { type: DataTypes.TEXT, allowNull: true },
    obs_insectos: { type: DataTypes.TEXT, allowNull: true },
    obs_film: { type: DataTypes.TEXT, allowNull: true },
    obs_humedad: { type: DataTypes.TEXT, allowNull: true },
    obs_interior: { type: DataTypes.TEXT, allowNull: true },
    obs_verificacion: { type: DataTypes.TEXT, allowNull: true },
    obs_insecticida: { type: DataTypes.TEXT, allowNull: true },
    
    // Cierre y Firmas
    estado_clima: { type: DataTypes.STRING, allowNull: true },
    observaciones_generales: { type: DataTypes.TEXT, allowNull: true },
    responsable_inspeccion: { type: DataTypes.STRING, allowNull: true },
    firma_inspector: { type: DataTypes.TEXT('long'), allowNull: true },
    firma_chofer: { type: DataTypes.TEXT('long'), allowNull: true },

    // Fotografías (Evidencia) - Paths / URLs
    foto_1: { type: DataTypes.STRING, allowNull: true },
    foto_2: { type: DataTypes.STRING, allowNull: true },
    foto_3: { type: DataTypes.STRING, allowNull: true },
    foto_4: { type: DataTypes.STRING, allowNull: true },
    foto_5: { type: DataTypes.STRING, allowNull: true },
    foto_6: { type: DataTypes.STRING, allowNull: true }
  }, { sequelize, tableName: 'controles_carga' });
};
