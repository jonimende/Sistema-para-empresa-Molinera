import { Model, DataTypes, Sequelize } from 'sequelize';

export class Producto extends Model {
  public declare id: number;
  public declare nombre: string;
}

export const initProducto = (sequelize: Sequelize) => {
  Producto.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'productos' });
};
