import { Model, DataTypes, Sequelize } from 'sequelize';

export class Acoplado extends Model {
  public declare id: number;
  public declare patente_acoplado: string;
  public declare fecha: Date;
  public declare chofer: string;
  public declare mant_lona: string;
  public declare mant_pollera: string;
  public declare verificacion_luces: string;
  public declare verificacion_frenos: string;
  public declare verificacion_hojas_elastico: string;
  public declare engrase_mensual: string;
  public declare lavado_acoplado: string;
  public declare ajuste_reemplazo_tapa: string;
  public declare observaciones: string;
  public declare se_reparo: string;
}

export const initAcoplado = (sequelize: Sequelize) => {
  Acoplado.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patente_acoplado: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: true },
    chofer: { type: DataTypes.STRING, allowNull: true },
    mant_lona: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    mant_pollera: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    verificacion_luces: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    verificacion_frenos: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    verificacion_hojas_elastico: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    engrase_mensual: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    lavado_acoplado: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    ajuste_reemplazo_tapa: { type: DataTypes.ENUM('Bueno', 'Malo'), allowNull: true },
    observaciones: { type: DataTypes.STRING, allowNull: true },
    se_reparo: { type: DataTypes.ENUM('Y', 'N'), allowNull: true }
  }, { sequelize, tableName: 'acoplados' });
};
