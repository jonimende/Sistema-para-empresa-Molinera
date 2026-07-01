import { Model, DataTypes, Sequelize } from 'sequelize';

export class CatAcoplados extends Model {
  public declare id: number;
  public declare nombre: string;
  public declare estado: boolean;
}

export const initCatAcoplados = (sequelize: Sequelize) => {
  CatAcoplados.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { sequelize, tableName: 'cat_acoplados', timestamps: false });
};
