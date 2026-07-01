import { Model, DataTypes, Sequelize } from 'sequelize';

export class TipoCarga extends Model {
  public declare id: number;
  public declare nombre: string;
  public declare estado: boolean;
}

export const initTipoCarga = (sequelize: Sequelize) => {
  TipoCarga.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { sequelize, tableName: 'tipo_cargas' });
};
