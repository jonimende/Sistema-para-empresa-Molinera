import { Model, DataTypes, Sequelize } from 'sequelize';

export class NoConformidad extends Model {
  public declare id: number;
  public declare fecha_reporte: Date;
  public declare ubicacion: string;
  public declare requisito_incumplido: string;
  public declare descripcion: string;
  public declare nombre_responsable: string;
  public declare estado: string;
  public declare accion_correctiva: string;
  public declare foto_url: string;
}

export const initNoConformidad = (sequelize: Sequelize) => {
  NoConformidad.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha_reporte: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    requisito_incumplido: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    nombre_responsable: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.ENUM('Pendiente', 'En Tratamiento', 'Cerrada'), allowNull: false, defaultValue: 'Pendiente' },
    accion_correctiva: { type: DataTypes.TEXT, allowNull: true },
    foto_url: { type: DataTypes.STRING, allowNull: true }
  }, { sequelize, tableName: 'no_conformidades' });
};
