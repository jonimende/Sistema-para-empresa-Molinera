import { Model, DataTypes, Sequelize } from 'sequelize';

export class RecorridaDiaria extends Model {
  public declare id: number;
  public declare fecha: Date;
  public declare responsable_nombre: string;
  public declare chk_roedores: string;
  public declare comentario_roedores: string;
  public declare chk_epp: string;
  public declare comentario_epp: string;
  public declare chk_banos: string;
  public declare comentario_banos: string;
  public declare chk_comedor: string;
  public declare comentario_comedor: string;
  public declare chk_molino_diario: string;
  public declare comentario_molino_diario: string;
  public declare chk_aberturas: string;
  public declare comentario_aberturas: string;
}

export const initRecorridaDiaria = (sequelize: Sequelize) => {
  const enumType = DataTypes.ENUM('CUMPLE', 'NO CUMPLE');
  
  RecorridaDiaria.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    responsable_nombre: { type: DataTypes.STRING, allowNull: false },
    chk_roedores: { type: enumType, allowNull: false },
    comentario_roedores: { type: DataTypes.TEXT, allowNull: true },
    chk_epp: { type: enumType, allowNull: false },
    comentario_epp: { type: DataTypes.TEXT, allowNull: true },
    chk_banos: { type: enumType, allowNull: false },
    comentario_banos: { type: DataTypes.TEXT, allowNull: true },
    chk_comedor: { type: enumType, allowNull: false },
    comentario_comedor: { type: DataTypes.TEXT, allowNull: true },
    chk_molino_diario: { type: enumType, allowNull: false },
    comentario_molino_diario: { type: DataTypes.TEXT, allowNull: true },
    chk_aberturas: { type: enumType, allowNull: false },
    comentario_aberturas: { type: DataTypes.TEXT, allowNull: true }
  }, { sequelize, tableName: 'recorridas_diarias' });
};
