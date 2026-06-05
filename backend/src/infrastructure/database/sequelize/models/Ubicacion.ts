import { Model, DataTypes, Sequelize } from 'sequelize';

export class Ubicacion extends Model {
  public declare id_appsheet: string;
  public declare nombre_lugar: string;
}

export const initUbicacion = (sequelize: Sequelize) => {
  Ubicacion.init({
    id_appsheet: { type: DataTypes.STRING, primaryKey: true },
    nombre_lugar: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'ubicaciones', timestamps: false });
};
