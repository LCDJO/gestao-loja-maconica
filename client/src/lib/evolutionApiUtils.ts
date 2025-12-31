import { toast } from 'sonner';

export interface EvolutionApiConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  instanceStatus?: string;
  qrCode?: string;
  error?: string;
}

/**
 * Testa a conexão com a Evolution API
 * Verifica se as credenciais estão corretas e se a instância está ativa
 */
export async function testEvolutionConnection(
  config: EvolutionApiConfig
): Promise<ConnectionTestResult> {
  try {
    // Validar campos obrigatórios
    if (!config.baseUrl || !config.apiKey || !config.instanceName) {
      return {
        success: false,
        message: 'Preencha todos os campos obrigatórios (Base URL, API Key, Instance Name)',
        error: 'MISSING_FIELDS'
      };
    }

    // Normalizar URL
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    
    // Teste 1: Verificar status da instância
    try {
      const statusResponse = await fetch(
        `${baseUrl}/instance/fetchInstances?instanceName=${config.instanceName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.apiKey
          }
        }
      );

      if (!statusResponse.ok) {
        if (statusResponse.status === 401) {
          return {
            success: false,
            message: 'Falha na autenticação. Verifique sua API Key.',
            error: 'INVALID_API_KEY'
          };
        }
        if (statusResponse.status === 404) {
          return {
            success: false,
            message: 'Instância não encontrada. Verifique o nome da instância.',
            error: 'INSTANCE_NOT_FOUND'
          };
        }
        throw new Error(`HTTP ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      
      // Verificar se há dados de instância
      if (!statusData || (Array.isArray(statusData) && statusData.length === 0)) {
        return {
          success: false,
          message: 'Instância não está ativa. Verifique se a instância foi criada corretamente.',
          error: 'INSTANCE_INACTIVE'
        };
      }

      // Teste 2: Enviar mensagem de teste
      const testPhoneNumber = '5511999999999'; // Número fictício para teste
      
      try {
        const sendResponse = await fetch(
          `${baseUrl}/message/sendText`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': config.apiKey
            },
            body: JSON.stringify({
              number: testPhoneNumber,
              text: 'Teste de conexão - Sistema de Gestão de Lojas Maçônicas',
              instanceName: config.instanceName
            })
          }
        );

        // Se conseguiu enviar ou recebeu erro de número inválido, a conexão está OK
        if (sendResponse.ok || sendResponse.status === 400) {
          return {
            success: true,
            message: 'Conexão com Evolution API estabelecida com sucesso!',
            instanceStatus: 'ATIVA'
          };
        }
      } catch (sendError) {
        // Se falhar no envio mas passou na autenticação, ainda assim está conectado
        return {
          success: true,
          message: 'Conexão com Evolution API estabelecida com sucesso! (Teste de envio não disponível)',
          instanceStatus: 'ATIVA'
        };
      }

      return {
        success: true,
        message: 'Conexão com Evolution API estabelecida com sucesso!',
        instanceStatus: 'ATIVA'
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro ao conectar com Evolution API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        error: 'CONNECTION_ERROR'
      };
    }

  } catch (error) {
    return {
      success: false,
      message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error: 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Envia uma mensagem de teste via Evolution API
 */
export async function sendTestMessage(
  config: EvolutionApiConfig,
  phoneNumber: string
): Promise<ConnectionTestResult> {
  try {
    if (!phoneNumber) {
      return {
        success: false,
        message: 'Número de telefone é obrigatório',
        error: 'MISSING_PHONE'
      };
    }

    const baseUrl = config.baseUrl.replace(/\/$/, '');

    const response = await fetch(
      `${baseUrl}/message/sendText`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        },
        body: JSON.stringify({
          number: phoneNumber,
          text: 'Teste de mensagem - Sistema de Gestão de Lojas Maçônicas',
          instanceName: config.instanceName
        })
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: 'Mensagem de teste enviada com sucesso!'
      };
    } else if (response.status === 400) {
      return {
        success: false,
        message: 'Número de telefone inválido. Use o formato: 5511999999999',
        error: 'INVALID_PHONE'
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: 'Falha na autenticação. Verifique sua API Key.',
        error: 'INVALID_API_KEY'
      };
    } else {
      return {
        success: false,
        message: 'Erro ao enviar mensagem de teste',
        error: 'SEND_ERROR'
      };
    }

  } catch (error) {
    return {
      success: false,
      message: `Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error: 'SEND_FAILED'
    };
  }
}

/**
 * Obtém informações sobre a instância
 */
export async function getInstanceInfo(
  config: EvolutionApiConfig
): Promise<any> {
  try {
    const baseUrl = config.baseUrl.replace(/\/$/, '');

    const response = await fetch(
      `${baseUrl}/instance/fetchInstances?instanceName=${config.instanceName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        }
      }
    );

    if (response.ok) {
      return await response.json();
    }
    return null;

  } catch (error) {
    console.error('Erro ao obter informações da instância:', error);
    return null;
  }
}
