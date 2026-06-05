import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public declare id: number;
  public declare username: string;
  public declare passwordHash: string;
  public declare role_id: number;
  public declare email: string;
  public declare is_active: boolean;
  public declare readonly role?: any; // For includes
}

export const initUser = (sequelize: Sequelize) => {
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { sequelize, tableName: 'users' });
};
