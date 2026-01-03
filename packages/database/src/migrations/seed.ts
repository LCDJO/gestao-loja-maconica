// Script de seed (dados iniciais)

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Exemplo de dados iniciais
    // Customize conforme necessário

    console.log('Database seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
