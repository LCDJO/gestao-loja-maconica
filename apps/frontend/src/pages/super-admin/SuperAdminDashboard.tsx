import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';
import { DashboardExecutivo, DashboardKPI, SystemStatus, MapaGeo } from '@shared/types/superadmin';
import styles from './SuperAdminDashboard.module.css';

/**
 * SuperAdminDashboard
 * Painel executivo com:
 * - KPIs em tempo real
 * - Gráficos de performance
 * - Status do sistema
 * - Mapa geográfico de uso
 * - Eventos recentes
 * - Alertas críticos
 */
export default function SuperAdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardExecutivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Mock data - em produção, buscar da API
  const mockDashboard: DashboardExecutivo = {
    kpis: {
      totalLojasAtivas: 247,
      totalUsuariosAtivos: 3482,
      sessõesSimultâneas: 89,
      mrrAtual: 52400,
      arrAnual: 628800,
      cresc_percentual_mes: 12.5,
      churnRate: 2.3,
      npsScore: 72,
    } as DashboardKPI,
    statusSistema: {
      api: { status: 'UP', uptime: 99.97, latência: 45 },
      database: { status: 'UP', uptime: 99.98, latência: 12 },
      filas: { status: 'DEGRADED', uptime: 99.5, latência: 250, mensagem: 'Fila de emails lenta' },
      alertasCríticos: 5,
      slaGlobal: 99.85,
      últimoCheck: new Date().toISOString(),
    } as SystemStatus,
    eventosRecentes: [
      {
        id: '1',
        tipo: 'deploy',
        descrição: 'Deploy v1.2.5 em produção',
        severidade: 'info',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        usuário: 'dev@company.com',
      },
      {
        id: '2',
        tipo: 'alerta',
        descrição: 'Taxa de erro em pico',
        severidade: 'warning',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: '3',
        tipo: 'pagamento',
        descrição: 'Novo pagamento recebido',
        severidade: 'info',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ],
    mapaUso: [
      { país: 'Brasil', estado: 'SP', lojas: 78, usuários: 1240, receita: 18500 },
      { país: 'Brasil', estado: 'RJ', lojas: 45, usuários: 680, receita: 10200 },
      { país: 'Brasil', estado: 'MG', lojas: 32, usuários: 420, receita: 6300 },
      { país: 'Brasil', estado: 'RS', lojas: 28, usuários: 380, receita: 5700 },
      { país: 'Brasil', estado: 'BA', lojas: 22, usuários: 290, receita: 4350 },
      { país: 'Brasil', estado: 'Outros', lojas: 42, usuários: 472, receita: 7050 },
    ],
    últimasLojas: [
      {
        id: '1',
        nome: 'Loja SP Centro',
        status: 'ativa',
        plano: 'professional',
        usuários: 45,
        dataContratação: '2025-01-01',
        mrrMensal: 2400,
      },
      {
        id: '2',
        nome: 'Loja RJ Copacabana',
        status: 'ativa',
        plano: 'professional',
        usuários: 38,
        dataContratação: '2024-12-15',
        mrrMensal: 2400,
      },
      {
        id: '3',
        nome: 'Loja MG',
        status: 'ativa',
        plano: 'basic',
        usuários: 25,
        dataContratação: '2024-12-01',
        mrrMensal: 1200,
      },
    ],
  };

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setDashboard(mockDashboard);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeframe]);

  if (loading) {
    return (
      <SuperAdminLayout pageTitle="Dashboard" pageDescription="Visão executiva da plataforma">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando dados...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!dashboard) return null;

  const kpis = dashboard.kpis;
  const status = dashboard.statusSistema;

  // Dados para gráficos
  const chartDataRPM = [
    { time: '00:00', rpm: 1200 },
    { time: '04:00', rpm: 1900 },
    { time: '08:00', rpm: 3200 },
    { time: '12:00', rpm: 2800 },
    { time: '16:00', rpm: 3900 },
    { time: '20:00', rpm: 3500 },
    { time: '23:59', rpm: 2100 },
  ];

  const chartDataMRR = [
    { mês: 'Nov', mrr: 45200 },
    { mês: 'Dez', mrr: 48600 },
    { mês: 'Jan', mrr: 52400 },
  ];

  const chartDataAssinantes = [
    { tipo: 'Free', value: 120 },
    { tipo: 'Trial', value: 42 },
    { tipo: 'Basic', value: 65 },
    { tipo: 'Professional', value: 18 },
    { tipo: 'Enterprise', value: 2 },
  ];

  const cores = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const statusColor = (status: string) => {
    switch (status) {
      case 'UP':
        return '#10b981';
      case 'DEGRADED':
        return '#f59e0b';
      case 'DOWN':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <SuperAdminLayout
      pageTitle="Dashboard Executivo"
      pageDescription="Visão em tempo real da plataforma SaaS"
      actions={
        <div className={styles.timeframeSelector}>
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              className={`${styles.tfButton} ${timeframe === tf ? styles.tfActive : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf === '24h' ? 'Hoje' : tf === '7d' ? '7 dias' : '30 dias'}
            </button>
          ))}
        </div>
      }
    >
      <div className={styles.dashboard}>
        {/* ===== SEÇÃO 1: KPIs EXECUTIVOS ===== */}
        <section className={styles.kpiSection}>
          <h2 className={styles.sectionTitle}>📊 KPIs Executivos</h2>
          <div className={styles.kpiGrid}>
            {/* Total de Lojas */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <Building2 size={24} className={styles.kpiIcon} />
                <h3>Lojas Ativas</h3>
              </div>
              <div className={styles.kpiValue}>{kpis.totalLojasAtivas.toLocaleString('pt-BR')}</div>
              <div className={styles.kpiFooter}>
                <TrendingUp size={14} />
                <span className={styles.trend}>+{kpis.cresc_percentual_mes}% este mês</span>
              </div>
            </div>

            {/* Usuários Ativos */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <Users size={24} className={styles.kpiIcon} />
                <h3>Usuários Ativos</h3>
              </div>
              <div className={styles.kpiValue}>{kpis.totalUsuariosAtivos.toLocaleString('pt-BR')}</div>
              <div className={styles.kpiFooter}>
                <span className={styles.secondary}>
                  {kpis.sessõesSimultâneas} sessões simultâneas agora
                </span>
              </div>
            </div>

            {/* MRR */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <DollarSign size={24} className={styles.kpiIcon} />
                <h3>MRR</h3>
              </div>
              <div className={styles.kpiValue}>
                R$ {(kpis.mrrAtual / 1000).toFixed(1)}k
              </div>
              <div className={styles.kpiFooter}>
                <span className={styles.secondary}>ARR: R$ {(kpis.arrAnual / 1000).toFixed(0)}k</span>
              </div>
            </div>

            {/* NPS Score */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <Activity size={24} className={styles.kpiIcon} />
                <h3>NPS Score</h3>
              </div>
              <div className={styles.kpiValue}>{kpis.npsScore}</div>
              <div className={styles.kpiFooter}>
                <span className={styles.secondary}>Excelente</span>
              </div>
            </div>

            {/* Churn Rate */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <TrendingUp size={24} className={styles.kpiIcon} />
                <h3>Churn Rate</h3>
              </div>
              <div className={styles.kpiValue}>{kpis.churnRate}%</div>
              <div className={styles.kpiFooter}>
                <span className={styles.secondary}>Muito bom</span>
              </div>
            </div>

            {/* Status Geral */}
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <CheckCircle size={24} className={styles.kpiIcon} />
                <h3>SLA Global</h3>
              </div>
              <div className={styles.kpiValue}>{status.slaGlobal}%</div>
              <div className={styles.kpiFooter}>
                <span className={styles.secondary}>{status.alertasCríticos} alertas críticos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 2: STATUS DO SISTEMA ===== */}
        <section className={styles.statusSection}>
          <h2 className={styles.sectionTitle}>🔍 Status do Sistema</h2>
          <div className={styles.statusGrid}>
            {[
              { nome: 'API', dados: status.api },
              { nome: 'Database', dados: status.database },
              { nome: 'Filas', dados: status.filas },
            ].map((service) => (
              <div key={service.nome} className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <div className={styles.statusDot} style={{ backgroundColor: statusColor(service.dados.status) }}></div>
                  <div>
                    <h4>{service.nome}</h4>
                    <p className={styles.statusValue}>{service.dados.status}</p>
                  </div>
                </div>
                <div className={styles.statusDetails}>
                  <div className={styles.statusMetric}>
                    <span className={styles.label}>Uptime</span>
                    <span className={styles.value}>{service.dados.uptime}%</span>
                  </div>
                  <div className={styles.statusMetric}>
                    <span className={styles.label}>Latência</span>
                    <span className={styles.value}>{service.dados.latência}ms</span>
                  </div>
                </div>
                {service.dados.mensagem && (
                  <div className={styles.statusMessage}>{service.dados.mensagem}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== SEÇÃO 3: GRÁFICOS ===== */}
        <div className={styles.chartsGrid}>
          {/* RPM */}
          <section className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Requisições por Minuto (RPM)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartDataRPM}>
                <defs>
                  <linearGradient id="colorRPM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rpm"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRPM)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          {/* MRR Trend */}
          <section className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Receita Mensal (MRR)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataMRR}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mês" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="mrr" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* Distribuição de Planos */}
          <section className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Distribuição por Plano</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataAssinantes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, value }) => `${type}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cores.map((cor, idx) => (
                    <Cell key={`cell-${idx}`} fill={cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </div>

        {/* ===== SEÇÃO 4: MAPA DE USO ===== */}
        <section className={styles.mapaSection}>
          <h2 className={styles.sectionTitle}>🌍 Distribuição Geográfica</h2>
          <div className={styles.mapaGrid}>
            {dashboard.mapaUso.map((regiao) => (
              <div key={`${regiao.país}-${regiao.estado}`} className={styles.mapaCard}>
                <div className={styles.mapaHeader}>
                  <MapPin size={18} />
                  <h4>{regiao.estado}</h4>
                </div>
                <div className={styles.mapaStats}>
                  <div className={styles.mapaStat}>
                    <span className={styles.label}>Lojas</span>
                    <span className={styles.valor}>{regiao.lojas}</span>
                  </div>
                  <div className={styles.mapaStat}>
                    <span className={styles.label}>Usuários</span>
                    <span className={styles.valor}>{regiao.usuários}</span>
                  </div>
                  <div className={styles.mapaStat}>
                    <span className={styles.label}>Receita</span>
                    <span className={styles.valor}>R$ {(regiao.receita / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SEÇÃO 5: EVENTOS RECENTES ===== */}
        <section className={styles.eventosSection}>
          <h2 className={styles.sectionTitle}>📢 Eventos Recentes</h2>
          <div className={styles.eventosList}>
            {dashboard.eventosRecentes.map((evento) => (
              <div key={evento.id} className={`${styles.eventoItem} ${styles[`evento-${evento.severidade}`]}`}>
                <div className={styles.eventoIcon}>
                  {evento.tipo === 'deploy' && '🚀'}
                  {evento.tipo === 'alerta' && '⚠️'}
                  {evento.tipo === 'pagamento' && '💰'}
                  {evento.tipo === 'login' && '👤'}
                  {evento.tipo === 'erro' && '❌'}
                </div>
                <div className={styles.eventoConteudo}>
                  <h4>{evento.descrição}</h4>
                  <p className={styles.eventoTempo}>
                    {new Date(evento.timestamp).toLocaleTimeString('pt-BR')}
                    {evento.usuário && ` • ${evento.usuário}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SEÇÃO 6: ÚLTIMAS LOJAS ===== */}
        <section className={styles.lojasSection}>
          <h2 className={styles.sectionTitle}>🏛️ Últimas Lojas Ativas</h2>
          <div className={styles.lojasTable}>
            <table>
              <thead>
                <tr>
                  <th>Loja</th>
                  <th>Status</th>
                  <th>Plano</th>
                  <th>Usuários</th>
                  <th>MRR</th>
                  <th>Data Contratação</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.últimasLojas.map((loja) => (
                  <tr key={loja.id}>
                    <td className={styles.lojaNome}>{loja.nome}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge-${loja.status}`]}`}>
                        {loja.status === 'ativa' ? '✓ Ativa' : loja.status}
                      </span>
                    </td>
                    <td>{loja.plano}</td>
                    <td className={styles.textCenter}>{loja.usuários}</td>
                    <td className={styles.valor}>R$ {(loja.mrrMensal / 1000).toFixed(1)}k</td>
                    <td className={styles.textCenter}>
                      {new Date(loja.dataContratação).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SuperAdminLayout>
  );
}
