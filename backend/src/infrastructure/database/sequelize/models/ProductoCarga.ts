import { Model, DataTypes, Sequelize } from 'sequelize';

export class ProductoCarga extends Model {
  public declare id_appsheet: string;
  public declare nombre_carga: string;
}

export const initProductoCarga = (sequelize: Sequelize) => {
  ProductoCarga.init({
    id_appsheet: { 
      type: DataTypes.STRING, 
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nombre_carga: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'productos_carga', timestamps: false });
};
