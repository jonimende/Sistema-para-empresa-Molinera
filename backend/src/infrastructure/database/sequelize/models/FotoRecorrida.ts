import { Model, DataTypes, Sequelize } from 'sequelize';

export class FotoRecorrida extends Model {
  public declare id: number;
  public declare recorrida_id: number;
  public declare foto_url: string;
  public declare detalle: string;
}

export const initFotoRecorrida = (sequelize: Sequelize) => {
  FotoRecorrida.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    recorrida_id: { type: DataTypes.INTEGER, allowNull: false },
    foto_url: { type: DataTypes.STRING, allowNull: false },
    detalle: { type: DataTypes.TEXT, allowNull: true }
  }, { sequelize, tableName: 'fotos_recorridas' });
};
