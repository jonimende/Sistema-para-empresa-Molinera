import { Model, DataTypes, Sequelize } from 'sequelize';

export class LugarViaje extends Model {
  public declare id: number;
  public declare nombre: string;
  public declare estado: boolean;
}

export const initLugarViaje = (sequelize: Sequelize) => {
  LugarViaje.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { sequelize, tableName: 'lugar_viajes' });
};
