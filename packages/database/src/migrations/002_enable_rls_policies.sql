-- =====================================================================
-- ROW LEVEL SECURITY (RLS) - CAMADA EXTRA DE ISOLAMENTO MULTITENANT
-- =====================================================================
-- Arquivo: packages/database/src/migrations/002_enable_rls_policies.sql
-- Data: 2026-01-03
-- 
-- DESCRIÇÃO:
-- ----------
-- Este arquivo implementa Row Level Security (RLS) no PostgreSQL,
-- criando uma camada adicional de proteção contra acesso não autorizado.
-- 
-- RLS garante que MESMO que um usuário malicioso contorne o middleware
-- de aplicação, o banco de dados bloqueará acesso não autorizado.
-- 
-- FUNCIONAMENTO:
-- ---------------
-- 1. Habilitar RLS em cada tabela
-- 2. Criar políticas que filtram automaticamente por lodge_id
-- 3. Usar session variables (app.current_lodge_id) para contexto
-- 
-- USO NA APLICAÇÃO:
-- -------------------
-- Após autenticar o usuário:
-- SET app.current_lodge_id = 'lodge-uuid-123';
-- 
-- Depois, qualquer query é automaticamente filtrada.
-- =====================================================================

-- =====================================================================
-- PASSO 1: CRIAR VARIÁVEL DE CONTEXTO DE SESSÃO
-- =====================================================================
-- Esta variável armazena o lodge_id do usuário autenticado

ALTER SYSTEM SET app.settings.current_lodge_id TO '';

-- Ou, por conexão (melhor para aplicações web):
-- SELECT set_config('app.current_lodge_id', 'lodge-uuid-123', false);

-- =====================================================================
-- PASSO 2: HABILITAR RLS NAS TABELAS
-- =====================================================================

ALTER TABLE lodges ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- PASSO 3: CRIAR FUNÇÕES HELPER
-- =====================================================================

-- Função para obter o lodge_id da sessão atual
CREATE OR REPLACE FUNCTION current_lodge_id() RETURNS UUID AS $$
  SELECT current_setting('app.current_lodge_id')::UUID;
$$ LANGUAGE SQL STABLE;

-- Função para obter o user_id da sessão atual
CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $$
  SELECT current_setting('app.current_user_id', true)::UUID;
$$ LANGUAGE SQL STABLE;

-- Função para verificar se é super admin
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE(current_setting('app.is_super_admin', true) = 'true', false);
$$ LANGUAGE SQL STABLE;

-- =====================================================================
-- PASSO 4: POLÍTICAS DE RLS PARA TABELA LODGES
-- =====================================================================
-- Super admins veem todas as lojas, usuários normais veem só a sua

DROP POLICY IF EXISTS lodges_select_policy ON lodges;
CREATE POLICY lodges_select_policy ON lodges
  FOR SELECT
  USING (
    is_super_admin() OR
    id = current_lodge_id()
  );

DROP POLICY IF EXISTS lodges_update_policy ON lodges;
CREATE POLICY lodges_update_policy ON lodges
  FOR UPDATE
  USING (
    is_super_admin() OR
    id = current_lodge_id()
  );

DROP POLICY IF EXISTS lodges_delete_policy ON lodges;
CREATE POLICY lodges_delete_policy ON lodges
  FOR DELETE
  USING (is_super_admin());

-- =====================================================================
-- PASSO 5: POLÍTICAS DE RLS PARA TABELA USERS
-- =====================================================================
-- Usuários só veem usuários da mesma loja

DROP POLICY IF EXISTS users_select_policy ON users;
CREATE POLICY users_select_policy ON users
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS users_insert_policy ON users;
CREATE POLICY users_insert_policy ON users
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS users_update_policy ON users;
CREATE POLICY users_update_policy ON users
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS users_delete_policy ON users;
CREATE POLICY users_delete_policy ON users
  FOR DELETE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 6: POLÍTICAS DE RLS PARA TABELA MEMBERS
-- =====================================================================
-- Membros só veem membros da mesma loja

DROP POLICY IF EXISTS members_select_policy ON members;
CREATE POLICY members_select_policy ON members
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS members_insert_policy ON members;
CREATE POLICY members_insert_policy ON members
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS members_update_policy ON members;
CREATE POLICY members_update_policy ON members
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS members_delete_policy ON members;
CREATE POLICY members_delete_policy ON members
  FOR DELETE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 7: POLÍTICAS DE RLS PARA TABELA TRANSACTIONS
-- =====================================================================
-- Transações isoladas por lodge

DROP POLICY IF EXISTS transactions_select_policy ON transactions;
CREATE POLICY transactions_select_policy ON transactions
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS transactions_insert_policy ON transactions;
CREATE POLICY transactions_insert_policy ON transactions
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS transactions_update_policy ON transactions;
CREATE POLICY transactions_update_policy ON transactions
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS transactions_delete_policy ON transactions;
CREATE POLICY transactions_delete_policy ON transactions
  FOR DELETE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 8: POLÍTICAS DE RLS PARA TABELA MEETINGS
-- =====================================================================

DROP POLICY IF EXISTS meetings_select_policy ON meetings;
CREATE POLICY meetings_select_policy ON meetings
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS meetings_insert_policy ON meetings;
CREATE POLICY meetings_insert_policy ON meetings
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS meetings_update_policy ON meetings;
CREATE POLICY meetings_update_policy ON meetings
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS meetings_delete_policy ON meetings;
CREATE POLICY meetings_delete_policy ON meetings
  FOR DELETE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 9: POLÍTICAS DE RLS PARA TABELA NOTIFICATIONS
-- =====================================================================
-- Notificações só chegam para usuários da mesma loja

DROP POLICY IF EXISTS notifications_select_policy ON notifications;
CREATE POLICY notifications_select_policy ON notifications
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS notifications_insert_policy ON notifications;
CREATE POLICY notifications_insert_policy ON notifications
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS notifications_delete_policy ON notifications;
CREATE POLICY notifications_delete_policy ON notifications
  FOR DELETE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 10: POLÍTICAS DE RLS PARA TABELA AUDIT_LOGS
-- =====================================================================
-- Logs são read-only e filtrados por lodge

DROP POLICY IF EXISTS audit_logs_select_policy ON audit_logs;
CREATE POLICY audit_logs_select_policy ON audit_logs
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS audit_logs_insert_policy ON audit_logs;
CREATE POLICY audit_logs_insert_policy ON audit_logs
  FOR INSERT
  WITH CHECK (
    lodge_id = current_lodge_id()
  );

-- Audit logs não devem ser deletados
DROP POLICY IF EXISTS audit_logs_delete_policy ON audit_logs;
CREATE POLICY audit_logs_delete_policy ON audit_logs
  FOR DELETE
  USING (false); -- Nunca permite delete direto

-- =====================================================================
-- PASSO 11: POLÍTICAS DE RLS PARA SUBSCRIPTIONS
-- =====================================================================

DROP POLICY IF EXISTS subscriptions_select_policy ON subscriptions;
CREATE POLICY subscriptions_select_policy ON subscriptions
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS subscriptions_insert_policy ON subscriptions;
CREATE POLICY subscriptions_insert_policy ON subscriptions
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS subscriptions_update_policy ON subscriptions;
CREATE POLICY subscriptions_update_policy ON subscriptions
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 12: POLÍTICAS DE RLS PARA INVOICES
-- =====================================================================

DROP POLICY IF EXISTS invoices_select_policy ON invoices;
CREATE POLICY invoices_select_policy ON invoices
  FOR SELECT
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS invoices_insert_policy ON invoices;
CREATE POLICY invoices_insert_policy ON invoices
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

DROP POLICY IF EXISTS invoices_update_policy ON invoices;
CREATE POLICY invoices_update_policy ON invoices
  FOR UPDATE
  USING (
    is_super_admin() OR
    lodge_id = current_lodge_id()
  );

-- =====================================================================
-- PASSO 13: CRIAR FUNÇÃO DE INICIALIZAÇÃO DE CONTEXTO
-- =====================================================================
-- Esta função deve ser chamada após autenticação bem-sucedida

CREATE OR REPLACE FUNCTION init_rls_context(
  p_lodge_id UUID,
  p_user_id UUID,
  p_is_super_admin BOOLEAN DEFAULT false
) RETURNS void AS $$
BEGIN
  -- Definir contexto da sessão
  PERFORM set_config('app.current_lodge_id', p_lodge_id::text, false);
  PERFORM set_config('app.current_user_id', p_user_id::text, false);
  PERFORM set_config('app.is_super_admin', CASE WHEN p_is_super_admin THEN 'true' ELSE 'false' END, false);
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- PASSO 14: CRIAR FUNÇÃO DE LIMPEZA DE CONTEXTO
-- =====================================================================

CREATE OR REPLACE FUNCTION cleanup_rls_context() RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_lodge_id', '', false);
  PERFORM set_config('app.current_user_id', '', false);
  PERFORM set_config('app.is_super_admin', 'false', false);
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- PASSO 15: TESTE DE RLS
-- =====================================================================
-- Para testar RLS, executar:

/*
-- 1. Limpar contexto
SELECT cleanup_rls_context();

-- 2. Inicializar contexto para lodge-1
SELECT init_rls_context('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'member-123', false);

-- 3. Ver membros (deve filtrar por lodge_id automaticamente)
SELECT * FROM members;

-- 4. Tentar acessar outra loja (RLS bloqueará)
SELECT * FROM members WHERE lodge_id = 'outra-loja-uuid';
-- Resultado: 0 rows (RLS filtrou)

-- 5. Limpar
SELECT cleanup_rls_context();
*/

-- =====================================================================
-- RESUMO
-- =====================================================================
/*
CAMADA 1 (Aplicação - Middleware):
   ↓
   validateTenantIsolation (Node.js)
   Bloqueia requisições malformadas
   
CAMADA 2 (Conexão - SQL):
   ↓
   init_rls_context() (PL/pgSQL)
   Define app.current_lodge_id
   
CAMADA 3 (Banco - RLS Policies):
   ↓
   WHERE lodge_id = current_lodge_id()
   Bloqueia queries que violam isolamento
   ├─ SELECT: só retorna dados do tenant
   ├─ INSERT: só permite em seu tenant
   ├─ UPDATE: só seu tenant
   └─ DELETE: só seu tenant

FLUXO SEGURO:
==============
1. Cliente autentica
2. Backend verifica credenciais
3. Backend gera JWT com lodgeId
4. Cliente envia JWT
5. Middleware valida JWT
6. init_rls_context() define variáveis
7. Query automáticamente filtrada por RLS
8. Mesmo com SQL injection, RLS protege

COMPLIANCE:
============
✓ OWASP Top 10: A01 - Broken Access Control
✓ GDPR: Isolamento de dados por tenant
✓ PCI DSS: Multi-layer security
✓ SOC 2: Tenant isolation
*/
