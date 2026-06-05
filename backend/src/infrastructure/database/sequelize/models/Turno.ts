import { Model, DataTypes, Sequelize } from 'sequelize';
export class Turno extends Model {
  public declare id: number;
  public declare nombre: string;
}
export const initTurno = (sequelize: Sequelize) => {
  Turno.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'turnos', timestamps: false });
};
