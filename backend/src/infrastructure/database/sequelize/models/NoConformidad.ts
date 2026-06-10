import { Model, DataTypes, Sequelize } from 'sequelize';

export class NoConformidad extends Model {
  public declare id: number;
  public declare nro_nc: string;
  public declare fecha_hora: Date;
  public declare requisito_incumplido: string;
  public declare ubicacion: string;
  public declare descripcion: string;
  public declare nombre_responsable: string | null;
  public declare firma_responsable: string | null;
  public declare quien_eleva: string;
  public declare estado: string;
  public declare accion_correctiva: string | null;
}

export const initNoConformidad = (sequelize: Sequelize) => {
  NoConformidad.init({
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nro_nc: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    fecha_hora: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    requisito_incumplido: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    ubicacion: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    descripcion: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    nombre_responsable: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    firma_responsable: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    quien_eleva: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    estado: { 
      type: DataTypes.ENUM('PENDIENTE', 'EN TRATAMIENTO', 'RESUELTO', 'CERRADO'), 
      allowNull: false, 
      defaultValue: 'PENDIENTE' 
    },
    accion_correctiva: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    }
  }, { 
    sequelize, 
    tableName: 'no_conformidades' 
  });
};
