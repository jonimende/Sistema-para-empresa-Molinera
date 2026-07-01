import { Model, DataTypes, Sequelize } from 'sequelize';

export class Vehiculo extends Model {
  public declare id: number;
  public declare id_appsheet: string;
  public declare patente_chasis: string;
  public declare marca: string;
  public declare modelo: string;
  public declare chofer_asignado: string;
  public declare email_chofer: string;
  public declare capacidad_kg: number;
}

export const initVehiculo = (sequelize: Sequelize) => {
  Vehiculo.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_appsheet: { type: DataTypes.STRING, allowNull: true },
    patente_chasis: { type: DataTypes.STRING, unique: true, allowNull: false },
    marca: { type: DataTypes.STRING, allowNull: true },
    modelo: { type: DataTypes.STRING, allowNull: true },
    chofer_asignado: { type: DataTypes.STRING, allowNull: true },
    email_chofer: { type: DataTypes.STRING, allowNull: true },
    capacidad_kg: { type: DataTypes.INTEGER, allowNull: true }
  }, { sequelize, tableName: 'vehiculos' });
};
