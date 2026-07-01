import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'erp_molino',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
    logging: console.log,
  }
);

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Add Cumple and No Cumple to engrase_mensual enum type
    // If enum type exists and already has the values, it will throw an error, we can catch it or ignore.
    try {
      await sequelize.query(`ALTER TYPE "enum_acoplados_engrase_mensual" ADD VALUE 'Cumple';`);
      console.log('Added Cumple to enum_acoplados_engrase_mensual');
    } catch (e: any) {
      console.log('Error adding Cumple (might already exist):', e.message);
    }

    try {
      await sequelize.query(`ALTER TYPE "enum_acoplados_engrase_mensual" ADD VALUE 'No Cumple';`);
      console.log('Added No Cumple to enum_acoplados_engrase_mensual');
    } catch (e: any) {
      console.log('Error adding No Cumple (might already exist):', e.message);
    }
    
    // Update existing records
    await sequelize.query(`UPDATE acoplados SET engrase_mensual = 'Cumple' WHERE engrase_mensual = 'Bueno';`);
    await sequelize.query(`UPDATE acoplados SET engrase_mensual = 'No Cumple' WHERE engrase_mensual = 'Malo';`);
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or run migration:', error);
  } finally {
    await sequelize.close();
  }
}

runMigration();
