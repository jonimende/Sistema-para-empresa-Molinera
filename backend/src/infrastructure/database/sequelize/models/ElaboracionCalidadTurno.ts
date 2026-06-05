import { Model, DataTypes, Sequelize } from 'sequelize';

export class ElaboracionCalidadTurno extends Model {
  public declare id: number;
  public declare elaboracion_parte_id: number;
  public declare hora: string;
  public declare porcentaje_ent: number;
  public declare porcentaje_queb: number;
  public declare molinero: string;
}

export const initElaboracionCalidadTurno = (sequelize: Sequelize) => {
  ElaboracionCalidadTurno.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    elaboracion_parte_id: { type: DataTypes.INTEGER, allowNull: false },
    hora: { type: DataTypes.TIME, allowNull: true },
    porcentaje_ent: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    porcentaje_queb: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molinero: { type: DataTypes.STRING, allowNull: true }
  }, { sequelize, tableName: 'elaboracion_calidad_turnos', timestamps: false });
};
