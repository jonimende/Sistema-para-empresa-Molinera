import { Model, DataTypes, Sequelize } from 'sequelize';

export class Viaje extends Model {
  public declare id: number;
  public declare chofer_email: string;
  public declare patente_chasis: string;
  public declare lugar_salida: string;
  public declare fecha_salida: Date;
  public declare hora_salida: string;
  public declare lugar_llegada: string;
  public declare fecha_llegada: Date;
  public declare hora_llegada: string;
  public declare km_recorridos: number;
  public declare carga_transportada: string;
  public declare kg_carga: number;
  public declare comprobante_relacionado: string;
  public declare numero_comprobante: string;
  public declare comentarios: string;
  public declare observaciones: string;
}

export const initViaje = (sequelize: Sequelize) => {
  Viaje.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chofer_email: { type: DataTypes.STRING, allowNull: false },
    patente_chasis: { type: DataTypes.STRING, allowNull: true },
    lugar_salida: { type: DataTypes.STRING, allowNull: false },
    fecha_salida: { type: DataTypes.DATEONLY, allowNull: false },
    hora_salida: { type: DataTypes.STRING, allowNull: false },
    lugar_llegada: { type: DataTypes.STRING, allowNull: false },
    fecha_llegada: { type: DataTypes.DATEONLY, allowNull: false },
    hora_llegada: { type: DataTypes.STRING, allowNull: false },
    km_recorridos: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    carga_transportada: { type: DataTypes.STRING, allowNull: true },
    kg_carga: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    comprobante_relacionado: { type: DataTypes.STRING, allowNull: true },
    numero_comprobante: { type: DataTypes.STRING, allowNull: true },
    comentarios: { type: DataTypes.TEXT, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true }
  }, { sequelize, tableName: 'viajes' });
};
