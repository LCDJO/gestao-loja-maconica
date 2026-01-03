// Schemas do banco de dados com isolamento multitenant
// Defina os schemas SQL aqui para referência

export const schemas = {
  // ============= TABELA PRINCIPAL DE TENANTS =============
  lodges: `
    CREATE TABLE IF NOT EXISTS lodges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      number VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      city VARCHAR(100),
      state VARCHAR(2),
      address TEXT,
      zip_code VARCHAR(20),
      founded_year INTEGER,
      subscription_plan VARCHAR(50) DEFAULT 'free',
      subscription_id UUID,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      max_members INTEGER DEFAULT 100,
      features JSONB DEFAULT '[]',
      settings JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID,
      CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended', 'cancelled'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_lodges_status ON lodges(status);
    CREATE INDEX IF NOT EXISTS idx_lodges_created_at ON lodges(created_at);
  `,

  // ============= TABELAS DE AUTENTICAÇÃO E USUÁRIOS (COM ISOLAMENTO) =============
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'member',
      is_super_admin BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(lodge_id, email),
      CONSTRAINT valid_role CHECK (role IN ('admin', 'secretary', 'treasurer', 'chancellor', 'member'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_lodge_id ON users(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_users_lodge_email ON users(lodge_id, email);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
  `,

  // ============= TABELAS DE MEMBROS (COM ISOLAMENTO) =============
  members: `
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      cim VARCHAR(50) NOT NULL,
      degree VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'ativo',
      birth_date DATE,
      initiation_date DATE,
      photo_url VARCHAR(500),
      documents_path VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(lodge_id, cim),
      CONSTRAINT valid_degree CHECK (degree IN ('aprendiz', 'companheiro', 'mestre')),
      CONSTRAINT valid_member_status CHECK (status IN ('ativo', 'inativo', 'irregular'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_members_lodge_id ON members(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
    CREATE INDEX IF NOT EXISTS idx_members_status ON members(lodge_id, status);
  `,

  // ============= TABELAS DE TRANSAÇÕES (COM ISOLAMENTO) =============
  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      date TIMESTAMP NOT NULL,
      type VARCHAR(50) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      member_id UUID REFERENCES members(id) ON DELETE SET NULL,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT valid_type CHECK (type IN ('receita', 'despesa')),
      CONSTRAINT valid_category CHECK (category IN ('mensalidade', 'tronco', 'aluguel', 'agape', 'materiais', 'outros', 'subscricao'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_transactions_lodge_id ON transactions(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(lodge_id, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(lodge_id, type);
  `,

  // ============= TABELAS DE REUNIÕES (COM ISOLAMENTO) =============
  meetings: `
    CREATE TABLE IF NOT EXISTS meetings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      date TIMESTAMP NOT NULL,
      type VARCHAR(100) NOT NULL,
      description TEXT,
      minutes_content TEXT,
      minutes_file_url VARCHAR(500),
      attendance_count INTEGER DEFAULT 0,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_meetings_lodge_id ON meetings(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(lodge_id, date);
  `,

  // ============= TABELAS DE NOTIFICAÇÕES (COM ISOLAMENTO) =============
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      title VARCHAR(255),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      read_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_notifications_lodge_id ON notifications(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
  `,

  // ============= TABELAS DE AUDITORIA (COM ISOLAMENTO) =============
  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id UUID,
      ip_address VARCHAR(45),
      user_agent TEXT,
      changes JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT valid_action CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_audit_logs_lodge_id ON audit_logs(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(lodge_id, created_at);
  `,

  // ============= TABELAS DE SUBSCRIPTIONS (PARA SAAS) =============
  subscriptions: `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL UNIQUE REFERENCES lodges(id) ON DELETE CASCADE,
      plan_id VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
      start_date TIMESTAMP NOT NULL,
      renewal_date TIMESTAMP,
      cancelled_at TIMESTAMP,
      amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'inactive', 'past_due', 'cancelled'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_subscriptions_lodge_id ON subscriptions(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
  `,

  // ============= TABELAS DE INVOICES (PARA SAAS) =============
  invoices: `
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lodge_id UUID NOT NULL REFERENCES lodges(id) ON DELETE CASCADE,
      subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
      invoice_number VARCHAR(50) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'draft',
      due_date TIMESTAMP NOT NULL,
      paid_date TIMESTAMP,
      payment_method VARCHAR(50),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(lodge_id, invoice_number),
      CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_invoices_lodge_id ON invoices(lodge_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
  `,
};
