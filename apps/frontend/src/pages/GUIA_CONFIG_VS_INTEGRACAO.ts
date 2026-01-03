/**
 * Guia Rápido de Organização
 * 
 * CONFIGURAÇÕES DA LOJA (dados internos)
 * Localização: apps/frontend/src/pages/config/
 * 
 * INTEGRAÇÕES DE SISTEMA (conexões externas)
 * Localização: apps/frontend/src/pages/integrations/
 */

// ============================================
// ⚙️ CONFIGURAÇÕES DA LOJA
// ============================================

// IMPORTAR ASSIM:
// import ConfiguracoesLoja from '@/pages/config/ConfiguracoesLoja';
// import GerenciamentoUsuarios from '@/pages/config/GerenciamentoUsuarios';
// import Permissoes from '@/pages/config/Permissoes';

// LOCALIZAÇÃO: /config/
// CONTEÚDO:
// - Dados da loja (nome, endereço, logo)
// - Usuários do sistema
// - Controle de permissões
// - Auditoria e logs
// - Backup e restauração
// - Templates de email
// - Parâmetros internos

// ============================================
// 🔗 INTEGRAÇÕES DE SISTEMA
// ============================================

// IMPORTAR ASSIM:
// import { IntegracoesSystemaDashboard } from '@/pages/integrations';
// import { IntegracoesPagamentos } from '@/pages/integrations/IntegracoesFinanceiras';

// LOCALIZAÇÃO: /integrations/
// CONTEÚDO:
// - Pagamentos (Stripe, PagSeguro, Pix)
// - Notificações (OneSignal, Firebase)
// - Agendamento (Google Calendar, Outlook)
// - Armazenamento (Google Drive, AWS S3)
// - Analytics (Google Analytics, Umami)
// - RH (Guia de Pontos, Zoho)
// - ERP (SAP, TOTVS, Odoo)
// - Comunicação (WhatsApp, Telegram)

// ============================================
// 🗺️ MAPA DE ROTAS
// ============================================

/**
 * CONFIGURAÇÕES
 * /config                    ← Página principal
 * /config/loja              ← Dados da loja
 * /config/usuarios          ← Gerenciamento de usuários
 * /config/permissoes        ← Controle de acesso
 * /config/auditoria         ← Logs do sistema
 * /config/acesso            ← Auditoria de acessos
 * /config/email             ← Configuração de email
 * /config/push              ← Notificações push
 * /config/parametrizacao    ← Parâmetros
 * /config/backup            ← Backup de dados
 * /config/conciliacao       ← Sincronização
 * /config/comunicados       ← Comunicados internos
 * /config/changelog         ← Histórico
 * 
 * INTEGRAÇÕES
 * /integracao               ← Dashboard principal
 * /integracao/pagamentos    ← Stripe, PagSeguro, Pix
 * /integracao/whatsapp      ← WhatsApp Business
 * /integracao/onesignal     ← Push notifications
 * /integracao/google-calendar ← Google Calendar
 * /integracao/google-drive  ← Google Drive
 * /integracao/analytics     ← Google Analytics
 * /integracao/guia-pontos   ← Guia de Pontos
 * /integracao/erp           ← Sistemas ERP
 */

// ============================================
// 📊 DIFERENÇAS
// ============================================

/**
 * CONFIGURAÇÕES DA LOJA
 * ✅ Dados específicos da loja
 * ✅ Armazenado em BD local
 * ✅ Controlado pelo admin da loja
 * ✅ Pouca variação no tempo
 * ✅ Exemplos:
 *    - Nome da loja: "Loja Maçônica Exemplo"
 *    - Endereço: Rua X, nº 123
 *    - Logo: arquivo PNG
 *    - Usuários: João, Maria, Pedro
 *    - Permissões: quem pode editar o quê
 * 
 * INTEGRAÇÕES DE SISTEMA
 * ✅ Conexões com serviços externos
 * ✅ Comunicam com APIs remotas
 * ✅ Controladas por TI/DevOps
 * ✅ Conforme contratos/assinaturas
 * ✅ Exemplos:
 *    - Stripe API Key: sk_live_xxx
 *    - WhatsApp Token: wab_xxx
 *    - OneSignal API: app-id-xxx
 *    - Google Calendar: client-id-xxx
 *    - Pix Backend: connection-id-xxx
 */

export {};
