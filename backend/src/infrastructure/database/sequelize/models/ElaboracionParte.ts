import { Model, DataTypes, Sequelize } from 'sequelize';

export class ElaboracionParte extends Model {
  public declare id: number;
  public declare fecha: Date;
  public declare nro_lote: string;
  public declare producto_elaborado: string;
  public declare horario_turno: string;
  public declare variedad: string;
  public declare porcentaje_quebrado_esperado: number;
  public declare envase: string;
  public declare grado: string;
  public declare silo_origen: string;
  public declare balanza_mp_total_kilos: number;
  public declare productor_lote_origen: string;

  public declare agregados_1_2_grano_kg: number;
  public declare agregados_arroz_elaborado_kg: number;

  public declare terminado_1_2_grano_kg: number;
  public declare terminado_arrocin_kg: number;
  public declare terminado_afrechillo_kg: number;
  public declare terminado_descarte_selectora_kg: number;
  public declare terminado_cascara_kg: number;
  public declare producto_terminado_kg: number;

  public declare molino_rendimiento: number;
  public declare molino_quebrado: number;
  public declare molino_enteros: number;
  public declare molino_ent_puros: number;
  public declare molino_prod_term_descarte: number;

  public declare molinillo_rendimiento: number;
  public declare molinillo_quebrado: number;
  public declare molinillo_enteros: number;
  public declare molinillo_me: number;
  public declare molinillo_yeso: number;
  public declare producto_terminado_esperado: number;

  public declare insp_bolsa: boolean;
  public declare insp_big_bag: boolean;
  public declare imanes_pulidora: boolean;
  public declare imanes_envasado: boolean;
  public declare zarandas_inicio: boolean;
  public declare zarandas_fin: boolean;

  public declare observaciones: string;
  public declare firma_inicio: string;
  public declare firma_cierre: string;
  public declare operario_nombre: string;
  public declare paradas: any;
  public declare controles_calidad: any;
}

export const initElaboracionParte = (sequelize: Sequelize) => {
  ElaboracionParte.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: true },
    nro_lote: { type: DataTypes.STRING, allowNull: true },
    producto_elaborado: { type: DataTypes.STRING, allowNull: true },
    horario_turno: { type: DataTypes.STRING, allowNull: true },
    variedad: { type: DataTypes.STRING, allowNull: true },
    porcentaje_quebrado_esperado: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    envase: { type: DataTypes.STRING, allowNull: true },
    grado: { type: DataTypes.STRING, allowNull: true },
    silo_origen: { type: DataTypes.STRING, allowNull: true },
    balanza_mp_total_kilos: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    productor_lote_origen: { type: DataTypes.STRING, allowNull: true },

    agregados_1_2_grano_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    agregados_arroz_elaborado_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    terminado_1_2_grano_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    terminado_arrocin_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    terminado_afrechillo_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    terminado_descarte_selectora_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    terminado_cascara_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    producto_terminado_kg: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    molino_rendimiento: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molino_quebrado: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molino_enteros: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molino_ent_puros: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molino_prod_term_descarte: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    molinillo_rendimiento: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molinillo_quebrado: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molinillo_enteros: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molinillo_me: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    molinillo_yeso: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    producto_terminado_esperado: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    insp_bolsa: { type: DataTypes.BOOLEAN, defaultValue: false },
    insp_big_bag: { type: DataTypes.BOOLEAN, defaultValue: false },
    imanes_pulidora: { type: DataTypes.BOOLEAN, defaultValue: false },
    imanes_envasado: { type: DataTypes.BOOLEAN, defaultValue: false },
    zarandas_inicio: { type: DataTypes.BOOLEAN, defaultValue: false },
    zarandas_fin: { type: DataTypes.BOOLEAN, defaultValue: false },

    observaciones: { type: DataTypes.TEXT, allowNull: true },
    firma_inicio: { type: DataTypes.STRING, allowNull: true },
    firma_cierre: { type: DataTypes.STRING, allowNull: true },
    operario_nombre: { type: DataTypes.STRING, allowNull: true },
    paradas: { type: DataTypes.JSONB, allowNull: true },
    controles_calidad: { type: DataTypes.JSONB, allowNull: true }
  }, { 
    sequelize, 
    tableName: 'elaboracion_partes'
  });
};
