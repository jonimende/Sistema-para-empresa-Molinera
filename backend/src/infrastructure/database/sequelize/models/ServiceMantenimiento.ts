import { Model, DataTypes, Sequelize } from 'sequelize';

export class ServiceMantenimiento extends Model {
  public declare id: number;
  public declare patente_chasis: string;
  public declare fecha: Date;
  public declare km: number;
  public declare proximo_cambio_filtro: number;
  public declare aceite_motor: boolean;
  public declare aire: boolean;
  public declare aceite: boolean;
  public declare combustible: boolean;
  public declare hidraulico: boolean;
  public declare caja: boolean;
  public declare diferencial: boolean;
  public declare lubricacion_chasis: boolean;
}

export const initServiceMantenimiento = (sequelize: Sequelize) => {
  ServiceMantenimiento.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patente_chasis: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    km: { type: DataTypes.INTEGER, allowNull: false },
    proximo_cambio_filtro: { type: DataTypes.INTEGER, allowNull: false },
    aceite_motor: { type: DataTypes.BOOLEAN, defaultValue: false },
    aire: { type: DataTypes.BOOLEAN, defaultValue: false },
    aceite: { type: DataTypes.BOOLEAN, defaultValue: false },
    combustible: { type: DataTypes.BOOLEAN, defaultValue: false },
    hidraulico: { type: DataTypes.BOOLEAN, defaultValue: false },
    caja: { type: DataTypes.BOOLEAN, defaultValue: false },
    diferencial: { type: DataTypes.BOOLEAN, defaultValue: false },
    lubricacion_chasis: { type: DataTypes.BOOLEAN, defaultValue: false },
    chofer_email: { type: DataTypes.STRING, allowNull: true }
  }, { sequelize, tableName: 'services_mantenimiento' });
};
