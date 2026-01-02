// Script de migração básico
// Implemente conforme necessário com um gerenciador de migrations

import { db } from '../client';
import { schemas } from '../schemas';

async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // Executar cada schema
    for (const [name, schema] of Object.entries(schemas)) {
      console.log(`Creating ${name}...`);
      await db.query(schema);
    }

    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
