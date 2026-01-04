/**
 * SuperAdmin - Tipos de Dados
 * Painel executivo do SaaS com visão completa da plataforma
 */

// ============================================================================
// DASHBOARD GERAL - KPIs e Estatísticas em Tempo Real
// ============================================================================

export interface DashboardKPI {
  totalLojasAtivas: number;
  totalUsuariosAtivos: number;
  sessõesSimultâneas: number;
  mrrAtual: number; // Monthly Recurring Revenue
  arrAnual: number; // Annual Recurring Revenue
  cresc_percentual_mes: number;
  churnRate: number; // % de clientes perdidos
  npsScore: number; // Net Promoter Score
}

export interface SystemStatus {
  api: HealthStatus;
  database: HealthStatus;
  filas: HealthStatus;
  alertasCríticos: number;
  slaGlobal: number; // % uptime
  últimoCheck: string; // ISO timestamp
}

export interface HealthStatus {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  uptime: number; // % uptime últimas 24h
  latência: number; // ms
  mensagem?: string;
}

export interface DashboardExecutivo {
  kpis: DashboardKPI;
  statusSistema: SystemStatus;
  eventosRecentes: EventoSistema[];
  mapaUso: MapaGeo[];
  últimasLojas: TenantSumário[];
}

export interface EventoSistema {
  id: string;
  tipo: 'deploy' | 'alerta' | 'erro' | 'login' | 'pagamento';
  descrição: string;
  severidade: 'info' | 'warning' | 'critical';
  timestamp: string;
  usuário?: string;
}

export interface MapaGeo {
  país: string;
  estado?: string;
  lojas: number;
  usuários: number;
  receita: number;
}

// ============================================================================
// TELEMETRIA & OBSERVABILIDADE
// ============================================================================

export interface TelemetriaAplicação {
  rpm: number; // Requisições por minuto
  p50: number; // Latência 50º percentil
  p95: number; // Latência 95º percentil
  p99: number; // Latência 99º percentil
  taxaErro4xx: number; // %
  taxaErro5xx: number; // %
  endpointsMaisUsados: EndpointMetric[];
  logsRecentes: LogAplicação[];
}

export interface EndpointMetric {
  path: string;
  método: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requisições: number;
  latênciaAvg: number;
  erros: number;
}

export interface LogAplicação {
  id: string;
  timestamp: string;
  nível: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  mensagem: string;
  stack?: string;
  contexto?: Record<string, any>;
}

export interface MicroserviçoMetrics {
  nome: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  cpu: number; // %
  ram: number; // %
  latência: number; // ms
  requisições: number;
  erros: number;
  healthcheck: {
    status: boolean;
    mensagem: string;
    timestamp: string;
  };
  circuitBreaker?: {
    estado: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    falhasConsecutivas: number;
  };
}

export interface InfraestruturaMetrics {
  nó: string;
  cpu: number; // %
  ram: number; // %
  disco: number; // %
  ioLeitura: number; // MB/s
  ioEscrita: number; // MB/s
  tráfego_entrada: number; // Mbps
  tráfego_saída: number; // Mbps
  uptime: number; // %
  containers?: number;
  autoscalingAtivo?: boolean;
}

export interface BancoDadosMetrics {
  conexõesAtivas: number;
  maxConexões: number;
  queriesLentas: QueryLenta[];
  locks: LockAtivo[];
  replicação: {
    status: 'ATIVA' | 'FALHOU';
    lag: number; // ms
  };
  backups: BackupInfo[];
  crescimento_gb: number;
}

export interface QueryLenta {
  query: string;
  tempo_ms: number;
  execuções: number;
  tenant_id?: string;
}

export interface LockAtivo {
  id: string;
  tipo: string;
  desde: string;
  tabela: string;
}

export interface BackupInfo {
  id: string;
  tipo: 'automático' | 'manual';
  timestamp: string;
  tamanho_gb: number;
  status: 'sucesso' | 'falha' | 'em_progresso';
  tenant_id?: string;
}

export interface FilasMetrics {
  fila: string;
  pendentes: number;
  falhados: number;
  processosTempo: number; // ms médio
  retentativas: number;
  dlq: number; // Dead Letter Queue
}

// ============================================================================
// GESTÃO DE TENANTS (Lojas Maçônicas)
// ============================================================================

export interface Tenant {
  id: string;
  nome: string;
  status: 'ativa' | 'suspensa' | 'onboarding' | 'deletada';
  plano: 'free' | 'trial' | 'basic' | 'professional' | 'enterprise';
  dataContratação: string;
  dataSuspensão?: string;
  dataCancelamento?: string;
  moeda: 'BRL' | 'USD';
  país: string;
  estado?: string;
  cidade?: string;
  contato: {
    email: string;
    telefone?: string;
    nomeResponsável: string;
  };
  limites: LimitesTenant;
  módulos: ModuloTenant[];
  configurações: ConfiguraçãoTenant;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSumário {
  id: string;
  nome: string;
  status: string;
  plano: string;
  usuários: number;
  dataContratação: string;
  mrrMensal: number;
}

export interface LimitesTenant {
  usuários: number;
  armazenamento_gb: number;
  requisições_dia: number;
  integraçõesTotal: number;
  webhooks: number;
}

export interface ModuloTenant {
  id: string;
  nome: 'secretaria' | 'hospitalaria' | 'tesouraria' | string;
  habilitado: boolean;
  versão: string;
  dataAtivação: string;
  dataDesativação?: string;
}

export interface ConfiguraçãoTenant {
  branding?: {
    logo?: string;
    corPrimária?: string;
    corSecundária?: string;
  };
  idioma: 'pt-BR' | 'en' | 'es';
  fusoHorário: string;
  notificações: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  politicaSenha?: {
    minCaracteres: number;
    requerEspeciais: boolean;
    requerNumeros: boolean;
    expiração_dias: number;
  };
}

// ============================================================================
// GESTÃO DE USUÁRIOS GLOBAIS
// ============================================================================

export interface SuperAdmin {
  id: string;
  email: string;
  nome: string;
  perfil: 'superadmin' | 'admin_interno';
  status: 'ativo' | 'bloqueado' | 'inativo';
  mfa: boolean;
  dataPrimeiroLogin?: string;
  dataSessãoUltima: string;
  permissões: string[];
  createdAt: string;
}

export interface SessãoUsuário {
  id: string;
  usuário_id: string;
  ipAddress: string;
  userAgent: string;
  inicioSessão: string;
  atividadeÚltima: string;
  ativa: boolean;
  localizaçãoAproximada?: string;
}

// ============================================================================
// PLANOS, ASSINATURAS & BILLING
// ============================================================================

export interface PlanoSaaS {
  id: string;
  nome: string;
  tipo: 'free' | 'trial' | 'pago';
  preço_mensal: number;
  preço_anual: number;
  desconto_anual: number; // %
  duração_trial_dias?: number;
  limites: {
    usuários: number;
    armazenamento_gb: number;
    requisições_dia: number;
    integraçõesTotal: number;
  };
  módulos: string[];
  suporte: 'email' | 'chat' | 'telefone' | 'dedicado';
  sla_uptime: number; // %
  descrição: string;
}

export interface Assinatura {
  id: string;
  tenant_id: string;
  plano_id: string;
  status: 'ativa' | 'vencida' | 'cancelada' | 'suspensa';
  dataInício: string;
  dataRenovação: string;
  dataCancelamento?: string;
  motívoCancelamento?: string;
  mrrAtual: number;
  totalPago: number;
}

export interface Fatura {
  id: string;
  tenant_id: string;
  assinatura_id: string;
  dataCriação: string;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  desconto?: number;
  taxas?: number;
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada';
  itens: ItemFatura[];
  metadosPagamento?: {
    gateway: 'pix' | 'cartao' | 'boleto' | 'transferencia';
    id_transação: string;
  };
}

export interface ItemFatura {
  descrição: string;
  quantidade: number;
  preço_unitário: number;
  desconto?: number;
  subtotal: number;
}

export interface CupomDesconto {
  id: string;
  código: string;
  tipo: 'percentual' | 'fixo';
  valor: number; // % ou valor
  dataValidade: string;
  usosRestantes?: number;
  usosTotal?: number;
  planoId?: string; // Específico para um plano?
  ativo: boolean;
}

export interface MétricasFinanceiras {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  churn: number; // %
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
  assinaturasAtivas: number;
  assinaturasVencidas: number;
  receitas_últimos_30: number;
  inadimplência_valor: number;
  inadimplência_lojasCount: number;
}

// ============================================================================
// INTEGRAÇÕES
// ============================================================================

export interface IntegracaoExterna {
  id: string;
  nome: string;
  tipo: 'webhook' | 'api' | 'plugin';
  status: 'ativa' | 'inativa' | 'erro';
  configuração: Record<string, any>;
  rateLimitReqs?: number;
  rateLimitJanela?: number; // minutos
  webhook_url?: string;
  eventos_subscritos?: string[];
  last_call?: string;
  logs: LogIntegração[];
}

export interface LogIntegração {
  timestamp: string;
  tipo: 'sucesso' | 'erro' | 'retry';
  statusCode?: number;
  mensagem?: string;
  tenant_id?: string;
}

export interface ChaveAPI {
  id: string;
  tenant_id: string;
  nome: string;
  chave: string; // mascarada em listagem
  status: 'ativa' | 'revogada';
  permissões: string[];
  rateLimitReqs: number;
  ultimoUso?: string;
  dataCriação: string;
  dataRevogação?: string;
}

// ============================================================================
// SEGURANÇA & COMPLIANCE
// ============================================================================

export interface LogAuditoria {
  id: string;
  usuário_id: string;
  ação: string;
  recurso: string;
  recurso_id: string;
  mudanças?: {
    anterior: any;
    nova: any;
  };
  tenant_id?: string;
  ipAddress: string;
  timestamp: string;
  resultado: 'sucesso' | 'falha';
  motivo_falha?: string;
}

export interface TentativaLogin {
  id: string;
  email: string;
  ipAddress: string;
  resultado: 'sucesso' | 'falha';
  motivo?: string;
  timestamp: string;
}

export interface AcessoSuspeito {
  id: string;
  usuário_id: string;
  tipo: 'múltiplos_logins_rapidos' | 'localizacao_improvável' | 'ip_suspeito' | 'tentativas_excessivas';
  descrição: string;
  ação_tomada: 'bloqueado' | 'notificado' | 'mfa_requerido' | 'nenhuma';
  timestamp: string;
}

export interface CertificadoSSL {
  domínio: string;
  provedor: string;
  dataEmissão: string;
  dataExpiração: string;
  status: 'ativo' | 'expirado' | 'pendente';
  auto_renovação: boolean;
}

// ============================================================================
// ALERTAS & MONITORAMENTO
// ============================================================================

export interface RegraAlerta {
  id: string;
  nome: string;
  métrica: string; // ex: "cpu", "error_rate", "churn"
  condição: '>' | '<' | '==' | '>=';
  threshold: number;
  duração_segundos?: number;
  ativada: boolean;
  canais: ('email' | 'slack' | 'pagerduty')[];
  createdAt: string;
}

export interface Incidente {
  id: string;
  título: string;
  descrição: string;
  severidade: 'low' | 'medium' | 'high' | 'critical';
  status: 'ativo' | 'resolvido' | 'falso_positivo';
  dataInício: string;
  dataResolução?: string;
  regra_alerta_id?: string;
  tenant_id?: string;
  escalações?: EscalaçãoIncidente[];
}

export interface EscalaçãoIncidente {
  id: string;
  incidente_id: string;
  usuário_escalado: string;
  timestamp: string;
  motivo?: string;
}

// ============================================================================
// DEPLOY & DEVOPS
// ============================================================================

export interface VersãoProdução {
  id: string;
  versão: string; // ex: v1.2.3
  dataRelease: string;
  ambiente: 'prod' | 'staging' | 'dev';
  responsável: string;
  alterações: string[];
  status: 'ativa' | 'anterior' | 'rollback';
  commit_hash?: string;
}

export interface Deploy {
  id: string;
  versão_id: string;
  ambiente: 'prod' | 'staging' | 'dev';
  dataInício: string;
  dataFim?: string;
  status: 'sucesso' | 'falha' | 'em_progresso' | 'rollback';
  responsável: string;
  logs: string;
  erro?: string;
  duracao_segundos?: number;
}

export interface VariávelAmbiente {
  chave: string;
  ambiente: 'prod' | 'staging' | 'dev';
  valor: string; // criptografado em armazenamento
  descrição: string;
  requerida: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureToggle {
  id: string;
  nome: string;
  descrição?: string;
  ativado: boolean;
  ambientes: {
    prod?: boolean;
    staging?: boolean;
    dev?: boolean;
  };
  percentualRollout?: number; // 0-100 para rollout gradual
  critério?: {
    tenant_ids?: string[];
    usuário_ids?: string[];
  };
}

// ============================================================================
// COMUNICAÇÃO & NOTIFICAÇÕES
// ============================================================================

export interface TemplateEmail {
  id: string;
  nome: string;
  assunto: string;
  corpo_html: string;
  variáveis: string[]; // {{nome_usuario}}, {{codigo}}
  idiomas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateWhatsApp {
  id: string;
  nome: string;
  corpo: string;
  variáveis: string[];
  template_id_provider?: string; // ID na Meta/Evolution
  aprovado: boolean;
}

export interface Campanha {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'push' | 'sms';
  status: 'rascunho' | 'agendada' | 'em_envio' | 'concluída' | 'cancelada';
  template_id: string;
  dataAgendamento?: string;
  dataInício?: string;
  dataFim?: string;
  destinatários: {
    filtro_tenant?: string[];
    filtro_usuário?: string[];
    total_selecionados?: number;
  };
  resultados?: {
    enviados: number;
    entregues: number;
    cliques: number;
    bounces: number;
    erros: number;
  };
  criada_por: string;
  createdAt: string;
}

export interface LogEnvioNotificação {
  id: string;
  campanha_id?: string;
  usuário_id: string;
  tipo: 'email' | 'whatsapp' | 'push' | 'sms';
  status: 'sucesso' | 'falha' | 'entregue' | 'bounce';
  timestamp: string;
  messageId?: string;
  motivo_falha?: string;
}

// ============================================================================
// RELATÓRIOS & BI
// ============================================================================

export interface RelatórioUso {
  id: string;
  período: {
    início: string;
    fim: string;
  };
  dados: {
    lojas_ativas: number;
    usuários_únicos: number;
    sessões: number;
    requisições_total: number;
    módulos_mais_usados: { nome: string; uso: number }[];
    crescimento_mês_anterior: number;
  };
  gráficos?: {
    tipo: 'linha' | 'barra' | 'pizza';
    dados: any[];
  };
}

export interface RelatórioFinanceiro {
  período: {
    início: string;
    fim: string;
  };
  receitas: {
    mrrAtual: number;
    arrAnual: number;
    novos_clientes: number;
    churn_clientes: number;
    arpu: number; // Average Revenue Per User
    mrr_por_plano: { plano: string; mrr: number }[];
  };
  despesas?: {
    infraestrutura: number;
    pessoal: number;
    marketing: number;
    outras: number;
  };
  lucro?: number;
}

export interface ConfigExportação {
  formato: 'csv' | 'pdf' | 'xlsx';
  colunas?: string[];
  filtros?: Record<string, any>;
}

// ============================================================================
// BACKUP & DISASTER RECOVERY
// ============================================================================

export interface BackupAutomático {
  id: string;
  frequência: 'diária' | 'semanal' | 'mensal';
  hora_execução: string; // HH:MM UTC
  dia_semana?: number;
  dia_mês?: number;
  retenção_dias: number;
  última_execução?: string;
  próxima_execução?: string;
  ativa: boolean;
}

export interface SessãoRestore {
  id: string;
  backup_id: string;
  tenant_id: string;
  dataInício: string;
  dataFim?: string;
  status: 'sucesso' | 'falha' | 'em_progresso';
  progressoPercental?: number;
  motivo_falha?: string;
  responsável: string;
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

export interface PaginaçãoParams {
  página: number;
  limite: number;
  ordenarPor?: string;
  ordem?: 'asc' | 'desc';
  filtros?: Record<string, any>;
}

export interface RespuestaLista<T> {
  dados: T[];
  total: number;
  página: number;
  próxima?: boolean;
  anterior?: boolean;
}

export interface NavegacaoContexto {
  secção_atual: string;
  subsecção?: string;
  filtros?: Record<string, any>;
  voltarPara?: string;
}
