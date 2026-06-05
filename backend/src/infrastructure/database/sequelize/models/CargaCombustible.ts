import { Model, DataTypes, Sequelize } from 'sequelize';

export class CargaCombustible extends Model {
  public declare id: number;
  public declare patente_chasis: string;
  public declare fecha: Date;
  public declare litros_gasoil: number;
  public declare kilometraje: number;
  public declare foto_tablero: string;
  public declare consumo_l_100km: number;
}

export const initCargaCombustible = (sequelize: Sequelize) => {
  CargaCombustible.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patente_chasis: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    litros_gasoil: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    kilometraje: { type: DataTypes.INTEGER, allowNull: false },
    foto_tablero: { type: DataTypes.STRING, allowNull: true },
    consumo_l_100km: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    chofer_email: { type: DataTypes.STRING, allowNull: true }
  }, { sequelize, tableName: 'cargas_combustible' });
};
