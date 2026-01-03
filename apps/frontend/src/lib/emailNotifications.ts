import { Bill, Member } from './types';
import { billingStore, memberStore, emailNotificationStore } from './store';

/**
 * Verifica quais cobranças precisam de notificação e cria as notificações pendentes
 */
export function checkAndCreateNotifications(): void {
  const bills = billingStore.getBills();
  const members = memberStore.getAll();
  const today = new Date();

  for (const bill of bills) {
    if (bill.status !== 'pending') continue;

    const member = members.find(m => m.id === bill.memberId);
    if (!member || !member.email) continue;

    const dueDate = new Date(bill.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Verificar se já existe notificação enviada para este cenário
    const existingNotifications = emailNotificationStore.getNotificationsByBill(bill.id);

    // Notificação de 3 dias antes do vencimento
    if (daysUntilDue === 3 && !existingNotifications.find(n => n.type === 'reminder_3days')) {
      emailNotificationStore.addNotification({
        billId: bill.id,
        memberId: bill.memberId,
        email: member.email,
        type: 'reminder_3days',
        subject: `Lembrete: Sua cobrança vence em 3 dias`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Notificação de 1 dia antes do vencimento
    if (daysUntilDue === 1 && !existingNotifications.find(n => n.type === 'reminder_1day')) {
      emailNotificationStore.addNotification({
        billId: bill.id,
        memberId: bill.memberId,
        email: member.email,
        type: 'reminder_1day',
        subject: `Urgente: Sua cobrança vence amanhã`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Notificação de 7 dias após vencimento
    if (daysUntilDue === -7 && !existingNotifications.find(n => n.type === 'overdue_7days')) {
      emailNotificationStore.addNotification({
        billId: bill.id,
        memberId: bill.memberId,
        email: member.email,
        type: 'overdue_7days',
        subject: `Aviso: Sua cobrança está atrasada há 7 dias`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Notificação de 15 dias após vencimento
    if (daysUntilDue === -15 && !existingNotifications.find(n => n.type === 'overdue_15days')) {
      emailNotificationStore.addNotification({
        billId: bill.id,
        memberId: bill.memberId,
        email: member.email,
        type: 'overdue_15days',
        subject: `Aviso Importante: Sua cobrança está atrasada há 15 dias`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }
  }
}

/**
 * Gera o conteúdo HTML do email de notificação
 */
export function generateEmailContent(bill: Bill, member: Member, type: string): { subject: string; html: string } {
  const dueDate = new Date(bill.dueDate).toLocaleDateString('pt-BR');
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(bill.amount);

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/membro/pendencias`;

  let subject = '';
  let html = '';

  switch (type) {
    case 'reminder_3days':
      subject = `Lembrete: Sua cobrança vence em 3 dias`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Olá, ${member.name}!</h2>
          <p>Gostaríamos de lembrá-lo que você possui uma cobrança pendente que vencerá em <strong>3 dias</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Valor:</strong> ${amount}</p>
            <p><strong>Vencimento:</strong> ${dueDate}</p>
          </div>
          <p>Para gerar a segunda via ou realizar o pagamento, <a href="${paymentLink}" style="color: #1e40af; text-decoration: none; font-weight: bold;">clique aqui</a>.</p>
          <p>Atenciosamente,<br>Loja Maçônica</p>
        </div>
      `;
      break;

    case 'reminder_1day':
      subject = `Urgente: Sua cobrança vence amanhã`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Atenção, ${member.name}!</h2>
          <p>Sua cobrança vencerá <strong>amanhã</strong>. Não perca o prazo!</p>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Valor:</strong> ${amount}</p>
            <p><strong>Vencimento:</strong> ${dueDate}</p>
          </div>
          <p><a href="${paymentLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Gerar Segunda Via Agora</a></p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Atenciosamente,<br>Loja Maçônica</p>
        </div>
      `;
      break;

    case 'overdue_7days':
      subject = `Aviso: Sua cobrança está atrasada há 7 dias`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Notificação de Atraso - ${member.name}</h2>
          <p>Informamos que sua cobrança está <strong>atrasada há 7 dias</strong>.</p>
          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
            <p><strong>Valor:</strong> ${amount}</p>
            <p><strong>Data de Vencimento:</strong> ${dueDate}</p>
            <p><strong>Status:</strong> Atrasado</p>
          </div>
          <p>Solicitamos que regularize sua situação o quanto antes. <a href="${paymentLink}" style="color: #d97706; text-decoration: none; font-weight: bold;">Clique aqui para gerar segunda via</a>.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Atenciosamente,<br>Loja Maçônica</p>
        </div>
      `;
      break;

    case 'overdue_15days':
      subject = `Aviso Importante: Sua cobrança está atrasada há 15 dias`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Aviso Importante - ${member.name}</h2>
          <p>Sua cobrança está <strong>atrasada há 15 dias</strong>. Ação imediata é necessária.</p>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Valor:</strong> ${amount}</p>
            <p><strong>Data de Vencimento:</strong> ${dueDate}</p>
            <p><strong>Dias em Atraso:</strong> 15</p>
          </div>
          <p>Por favor, regularize sua situação imediatamente. <a href="${paymentLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Gerar Segunda Via</a></p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Atenciosamente,<br>Loja Maçônica</p>
        </div>
      `;
      break;

    default:
      subject = 'Notificação de Cobrança';
      html = '<p>Você possui uma cobrança pendente.</p>';
  }

  return { subject, html };
}

/**
 * Simula o envio de email (em produção, seria integrado com SMTP/SendGrid/Mailgun)
 */
export async function sendEmailNotification(notification: any): Promise<boolean> {
  try {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));

    // Em produção, aqui seria feita a chamada real para o serviço de email
    console.log(`Email enviado para ${notification.email}: ${notification.subject}`);

    // Atualizar status da notificação
    emailNotificationStore.updateNotification(notification.id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    emailNotificationStore.updateNotification(notification.id, {
      status: 'failed',
      failureReason: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return false;
  }
}

/**
 * Processa todas as notificações pendentes
 */
export async function processPendingNotifications(): Promise<{ sent: number; failed: number }> {
  const notifications = emailNotificationStore.getNotifications();
  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  let sent = 0;
  let failed = 0;

  for (const notification of pendingNotifications) {
    const success = await sendEmailNotification(notification);
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}
