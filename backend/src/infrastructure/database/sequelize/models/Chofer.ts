import { Model, DataTypes, Sequelize } from 'sequelize';

export class Chofer extends Model {
  public declare id: number;
  public declare nombre: string;
}

export const initChofer = (sequelize: Sequelize) => {
  Chofer.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'choferes', timestamps: false });
};
