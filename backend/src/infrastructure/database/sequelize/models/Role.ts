import { Model, DataTypes, Sequelize } from 'sequelize';

export class Role extends Model {
  public declare id: number;
  public declare name: string; 
}

export const initRole = (sequelize: Sequelize) => {
  Role.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
  }, { sequelize, tableName: 'roles' });
};
