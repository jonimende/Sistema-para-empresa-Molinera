import { Model, DataTypes, Sequelize } from 'sequelize';

export class Permission extends Model {
  public declare id: number;
  public declare name: string;
}

export const initPermission = (sequelize: Sequelize) => {
  Permission.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
  }, { sequelize, tableName: 'permissions' });
};

export class RolePermission extends Model {}

export const initRolePermission = (sequelize: Sequelize) => {
  RolePermission.init({
    role_id: { type: DataTypes.INTEGER, primaryKey: true },
    permission_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, { sequelize, tableName: 'role_permissions', timestamps: false });
};
