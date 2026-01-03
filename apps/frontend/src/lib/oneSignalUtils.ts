/**
 * Utilitários para integração com OneSignal
 * Envia notificações push para dispositivos móveis
 */

export interface OneSignalPushPayload {
  headings: { en: string; pt: string };
  contents: { en: string; pt: string };
  data?: Record<string, any>;
  include_external_user_ids?: string[];
  filters?: Array<Record<string, any>>;
}

export interface OneSignalConfig {
  appId: string;
  apiKey: string;
  enabled: boolean;
}

/**
 * Simular envio de notificação push via OneSignal
 * Em produção, isso seria uma chamada real à API do OneSignal
 */
export const sendPushNotification = async (
  config: OneSignalConfig,
  payload: OneSignalPushPayload
): Promise<boolean> => {
  if (!config.enabled || !config.appId || !config.apiKey) {
    console.warn('OneSignal não está configurado');
    return false;
  }

  try {
    // Em um ambiente real, faria uma chamada à API do OneSignal
    // const response = await fetch('https://onesignal.com/api/v1/notifications', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': `Basic ${config.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     app_id: config.appId,
    //     ...payload,
    //   }),
    // });

    // Simular sucesso
    console.log('Notificação push enviada com sucesso:', payload);
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação push:', error);
    return false;
  }
};

/**
 * Enviar notificação push quando um comunicado é enviado
 */
export const sendComunicadoPushNotification = async (
  config: OneSignalConfig,
  comunicado: {
    title: string;
    content: string;
    audience: string;
  }
) => {
  const audienceLabel = {
    todos: 'Todos os membros',
    oficiais: 'Oficiais',
    aprendizes: 'Aprendizes',
    mestres: 'Mestres',
  }[comunicado.audience] || comunicado.audience;

  const payload: OneSignalPushPayload = {
    headings: {
      en: `New Message: ${comunicado.title}`,
      pt: `Novo Comunicado: ${comunicado.title}`,
    },
    contents: {
      en: `Sent to ${audienceLabel}. ${comunicado.content.substring(0, 50)}...`,
      pt: `Enviado para ${audienceLabel}. ${comunicado.content.substring(0, 50)}...`,
    },
    data: {
      type: 'comunicado',
      title: comunicado.title,
      audience: comunicado.audience,
    },
  };

  return sendPushNotification(config, payload);
};

/**
 * Enviar notificação push quando reunião é sincronizada
 */
export const sendMeetingSyncPushNotification = async (
  config: OneSignalConfig,
  meetingCount: number
) => {
  const payload: OneSignalPushPayload = {
    headings: {
      en: 'Meetings Synchronized',
      pt: 'Reuniões Sincronizadas',
    },
    contents: {
      en: `${meetingCount} meetings have been synchronized to your calendar`,
      pt: `${meetingCount} reuniões foram sincronizadas ao seu calendário`,
    },
    data: {
      type: 'reuniao',
      count: meetingCount,
    },
  };

  return sendPushNotification(config, payload);
};

/**
 * Enviar notificação push de teste
 */
export const sendTestPushNotification = async (config: OneSignalConfig) => {
  const payload: OneSignalPushPayload = {
    headings: {
      en: 'Test Notification',
      pt: 'Notificação de Teste',
    },
    contents: {
      en: 'This is a test notification from the Masonic Lodge Management System',
      pt: 'Esta é uma notificação de teste do Sistema de Gestão de Lojas Maçônicas',
    },
    data: {
      type: 'sistema',
      test: true,
    },
  };

  return sendPushNotification(config, payload);
};
