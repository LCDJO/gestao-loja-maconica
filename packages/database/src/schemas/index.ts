// Schemas do banco de dados
// Defina os schemas SQL aqui para referência

export const schemas = {
  // Tabelas de autenticação e usuários
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Tabelas de membros
  members: `
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      cim VARCHAR(50) UNIQUE NOT NULL,
      degree VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'ativo',
      birth_date DATE,
      initiation_date DATE,
      photo_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Tabelas de transações
  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date TIMESTAMP NOT NULL,
      type VARCHAR(50) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      member_id UUID REFERENCES members(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Tabelas de notificações
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      type VARCHAR(100) NOT NULL,
      title VARCHAR(255),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Tabelas de auditoria
  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id VARCHAR(100),
      changes JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,
};
