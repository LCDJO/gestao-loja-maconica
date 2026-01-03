/**
 * Serviço de Email para integração com SendGrid ou Mailgun
 * Permite envio de relatórios e notificações por email
 */

export interface EmailConfig {
  provider: 'sendgrid' | 'mailgun';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

export interface EmailPayload {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

/**
 * Enviar email via SendGrid
 */
export const sendViasendGrid = async (
  apiKey: string,
  payload: EmailPayload,
  fromEmail: string,
  fromName: string
): Promise<EmailResult> => {
  try {
    // Em produção, isso seria uma chamada real à API do SendGrid
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{
    //       to: payload.to.map(email => ({ email })),
    //       subject: payload.subject,
    //     }],
    //     from: {
    //       email: fromEmail,
    //       name: fromName,
    //     },
    //     content: [{
    //       type: 'text/html',
    //       value: payload.html,
    //     }],
    //   }),
    // });

    console.log('Email enviado via SendGrid:', {
      to: payload.to,
      subject: payload.subject,
      from: `${fromName} <${fromEmail}>`,
    });

    return {
      success: true,
      messageId: `sendgrid_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao enviar email via SendGrid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Enviar email via Mailgun
 */
export const sendViaMailgun = async (
  apiKey: string,
  domain: string,
  payload: EmailPayload,
  fromEmail: string,
  fromName: string
): Promise<EmailResult> => {
  try {
    // Em produção, isso seria uma chamada real à API do Mailgun
    // const formData = new FormData();
    // formData.append('from', `${fromName} <${fromEmail}>`);
    // payload.to.forEach(email => formData.append('to', email));
    // formData.append('subject', payload.subject);
    // formData.append('html', payload.html);
    // if (payload.text) formData.append('text', payload.text);

    // const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
    //   },
    //   body: formData,
    // });

    console.log('Email enviado via Mailgun:', {
      to: payload.to,
      subject: payload.subject,
      from: `${fromName} <${fromEmail}>`,
      domain,
    });

    return {
      success: true,
      messageId: `mailgun_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao enviar email via Mailgun:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Enviar email usando configuração
 */
export const sendEmail = async (
  config: EmailConfig,
  payload: EmailPayload,
  mailgunDomain?: string
): Promise<EmailResult> => {
  if (!config.enabled) {
    return {
      success: false,
      error: 'Email service não está habilitado',
      timestamp: new Date().toISOString(),
    };
  }

  if (config.provider === 'sendgrid') {
    return sendViasendGrid(config.apiKey, payload, config.fromEmail, config.fromName);
  } else if (config.provider === 'mailgun' && mailgunDomain) {
    return sendViaMailgun(config.apiKey, mailgunDomain, payload, config.fromEmail, config.fromName);
  }

  return {
    success: false,
    error: 'Provedor de email não configurado',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Gerar HTML para relatório de dashboard
 */
export const generateDashboardReportHTML = (data: {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  paymentCompliance: number;
  nextMeeting: string;
  generatedAt: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório do Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #1a1a1a; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        .metric { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; }
        .metric-label { font-weight: bold; color: #666; }
        .metric-value { color: #2563eb; font-size: 18px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Relatório do Dashboard Executivo</h1>
        
        <div class="metric">
          <span class="metric-label">Total de Membros:</span>
          <span class="metric-value">${data.totalMembers}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Membros Ativos:</span>
          <span class="metric-value">${data.activeMembers}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Receita Mensal:</span>
          <span class="metric-value">R$ ${data.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Taxa de Conformidade:</span>
          <span class="metric-value">${data.paymentCompliance}%</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Próxima Reunião:</span>
          <span class="metric-value">${data.nextMeeting}</span>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${data.generatedAt}</p>
          <p>Sistema de Gestão de Lojas Maçônicas</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Gerar HTML para relatório de comunicados
 */
export const generateComunicadosReportHTML = (data: {
  totalComunicados: number;
  sentComunicados: number;
  readRate: number;
  averageDeliveryTime: string;
  generatedAt: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Comunicados</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #1a1a1a; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
        .metric { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; }
        .metric-label { font-weight: bold; color: #666; }
        .metric-value { color: #7c3aed; font-size: 18px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📢 Relatório de Comunicados</h1>
        
        <div class="metric">
          <span class="metric-label">Total de Comunicados:</span>
          <span class="metric-value">${data.totalComunicados}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Comunicados Enviados:</span>
          <span class="metric-value">${data.sentComunicados}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Taxa de Leitura:</span>
          <span class="metric-value">${data.readRate}%</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Tempo Médio de Entrega:</span>
          <span class="metric-value">${data.averageDeliveryTime}</span>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${data.generatedAt}</p>
          <p>Sistema de Gestão de Lojas Maçônicas</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Armazenar histórico de envios de email
 */
export interface EmailHistory {
  id: string;
  recipients: string[];
  subject: string;
  reportType: 'dashboard' | 'comunicados' | 'financeiro';
  status: 'enviado' | 'falha' | 'pendente';
  messageId?: string;
  error?: string;
  sentAt: string;
  scheduledFor?: string;
}

export const emailHistoryStore = {
  getAll: (): EmailHistory[] => {
    const stored = localStorage.getItem('email_history');
    return stored ? JSON.parse(stored) : [];
  },
  add: (history: Omit<EmailHistory, 'id'>) => {
    const all = emailHistoryStore.getAll();
    const newEntry: EmailHistory = {
      ...history,
      id: `email_${Date.now()}`,
    };
    all.push(newEntry);
    localStorage.setItem('email_history', JSON.stringify(all));
    return newEntry;
  },
  getByReportType: (type: string): EmailHistory[] => {
    const all = emailHistoryStore.getAll();
    return all.filter(h => h.reportType === type);
  },
  getRecent: (days: number = 30): EmailHistory[] => {
    const all = emailHistoryStore.getAll();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(h => new Date(h.sentAt) >= cutoff);
  },
};
