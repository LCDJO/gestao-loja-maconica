-- =====================================================================
-- Migration 001: Adicionar Suporte a Multitenant
-- Data: 2026-01-03
-- Descrição: Adiciona isolamento de dados por lodge (tenant)
-- =====================================================================

-- 1. Criar tabela LODGES (tenants)
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

-- 2. Adicionar coluna lodge_id à tabela users
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Atualizar papel de usuários
ALTER TABLE IF EXISTS users 
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE IF EXISTS users 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'secretary', 'treasurer', 'chancellor', 'member'));

-- Adicionar restrição de unicidade por lodge
ALTER TABLE IF EXISTS users 
DROP CONSTRAINT IF EXISTS users_email_key;

ALTER TABLE IF EXISTS users 
ADD CONSTRAINT users_lodge_email_unique UNIQUE(lodge_id, email);

CREATE INDEX IF NOT EXISTS idx_users_lodge_id ON users(lodge_id);
CREATE INDEX IF NOT EXISTS idx_users_lodge_email ON users(lodge_id, email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 3. Adicionar coluna lodge_id à tabela members
ALTER TABLE IF EXISTS members 
ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE CASCADE;

-- Adicionar restrição de unicidade por lodge
ALTER TABLE IF EXISTS members 
DROP CONSTRAINT IF EXISTS members_cim_key;

ALTER TABLE IF EXISTS members 
ADD CONSTRAINT members_lodge_cim_unique UNIQUE(lodge_id, cim);

ALTER TABLE IF EXISTS members
DROP CONSTRAINT IF EXISTS valid_degree;

ALTER TABLE IF EXISTS members
ADD CONSTRAINT valid_degree CHECK (degree IN ('aprendiz', 'companheiro', 'mestre'));

ALTER TABLE IF EXISTS members
DROP CONSTRAINT IF EXISTS valid_member_status;

ALTER TABLE IF EXISTS members
ADD CONSTRAINT valid_member_status CHECK (status IN ('ativo', 'inativo', 'irregular'));

CREATE INDEX IF NOT EXISTS idx_members_lodge_id ON members(lodge_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(lodge_id, status);

-- 4. Adicionar coluna lodge_id à tabela transactions
ALTER TABLE IF EXISTS transactions 
ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS transactions 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS transactions
DROP CONSTRAINT IF EXISTS valid_type;

ALTER TABLE IF EXISTS transactions
ADD CONSTRAINT valid_type CHECK (type IN ('receita', 'despesa'));

ALTER TABLE IF EXISTS transactions
DROP CONSTRAINT IF EXISTS valid_category;

ALTER TABLE IF EXISTS transactions
ADD CONSTRAINT valid_category CHECK (category IN ('mensalidade', 'tronco', 'aluguel', 'agape', 'materiais', 'outros', 'subscricao'));

CREATE INDEX IF NOT EXISTS idx_transactions_lodge_id ON transactions(lodge_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(lodge_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(lodge_id, type);

-- 5. Adicionar coluna lodge_id à tabela notifications
ALTER TABLE IF EXISTS notifications 
ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS notifications 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_notifications_lodge_id ON notifications(lodge_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- 6. Adicionar coluna lodge_id à tabela audit_logs
ALTER TABLE IF EXISTS audit_logs 
ADD COLUMN IF NOT EXISTS lodge_id UUID REFERENCES lodges(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS audit_logs 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

ALTER TABLE IF EXISTS audit_logs 
ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE IF EXISTS audit_logs
DROP CONSTRAINT IF EXISTS valid_action;

ALTER TABLE IF EXISTS audit_logs
ADD CONSTRAINT valid_action CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT'));

CREATE INDEX IF NOT EXISTS idx_audit_logs_lodge_id ON audit_logs(lodge_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(lodge_id, created_at);

-- 7. Criar tabela MEETINGS
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

-- 8. Criar tabela SUBSCRIPTIONS (para SaaS)
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

-- 9. Criar tabela INVOICES (para SaaS)
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

-- 10. Seed de dados iniciais (um lodge padrão para testes)
INSERT INTO lodges (name, number, email, status, created_at)
VALUES ('Loja Padrão', '001', 'admin@default-lodge.com', 'active', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================================
-- Fim da Migration 001
-- =====================================================================
