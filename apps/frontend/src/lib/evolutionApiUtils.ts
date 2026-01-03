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
  config: EvolutionApiConfig,
  useRetry: boolean = true
): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
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

      const result = {
        success: true,
        message: 'Conexão com Evolution API estabelecida com sucesso!',
        instanceStatus: 'ATIVA'
      };

      // Log do teste bem-sucedido
      const duration = Date.now() - startTime;
      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'connection',
        status: 'success',
        message: result.message,
        duration
      });

      return result;

    } catch (error) {
      const result = {
        success: false,
        message: `Erro ao conectar com Evolution API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        error: 'CONNECTION_ERROR'
      };

      // Log do teste com erro
      const duration = Date.now() - startTime;
      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'connection',
        status: 'error',
        message: result.message,
        errorCode: result.error,
        duration
      });

      // Retry com exponential backoff se habilitado
      if (useRetry && error instanceof Error && error.message.includes('fetch')) {
        try {
          return await retryWithBackoff(
            () => testEvolutionConnection(config, false),
            2,
            500
          );
        } catch (retryError) {
          return result;
        }
      }

      return result;
    }

  } catch (error) {
    const result = {
      success: false,
      message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error: 'UNKNOWN_ERROR'
    };

    // Log do erro inesperado
    const duration = Date.now() - startTime;
    TestLogManager.addLog({
      instanceName: config.instanceName,
      type: 'connection',
      status: 'error',
      message: result.message,
      errorCode: result.error,
      duration
    });

    return result;
  }
}

/**
 * Envia uma mensagem de teste via Evolution API
 */
export async function sendTestMessage(
  config: EvolutionApiConfig,
  phoneNumber: string,
  useRetry: boolean = true
): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
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

    const duration = Date.now() - startTime;
    
    if (response.ok) {
      const result = {
        success: true,
        message: 'Mensagem de teste enviada com sucesso!'
      };

      // Log do envio bem-sucedido
      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'message',
        status: 'success',
        message: result.message,
        duration
      });

      return result;
    } else if (response.status === 400) {
      const result = {
        success: false,
        message: 'Número de telefone inválido. Use o formato: 5511999999999',
        error: 'INVALID_PHONE'
      };

      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'message',
        status: 'error',
        message: result.message,
        errorCode: result.error,
        duration
      });

      return result;
    } else if (response.status === 401) {
      const result = {
        success: false,
        message: 'Falha na autenticação. Verifique sua API Key.',
        error: 'INVALID_API_KEY'
      };

      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'message',
        status: 'error',
        message: result.message,
        errorCode: result.error,
        duration
      });

      return result;
    } else {
      const result = {
        success: false,
        message: 'Erro ao enviar mensagem de teste',
        error: 'SEND_ERROR'
      };

      TestLogManager.addLog({
        instanceName: config.instanceName,
        type: 'message',
        status: 'error',
        message: result.message,
        errorCode: result.error,
        duration
      });

      // Retry com exponential backoff se habilitado
      if (useRetry) {
        try {
          return await retryWithBackoff(
            () => sendTestMessage(config, phoneNumber, false),
            2,
            500
          );
        } catch (retryError) {
          return result;
        }
      }

      return result;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      success: false,
      message: `Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error: 'SEND_FAILED'
    };

    TestLogManager.addLog({
      instanceName: config.instanceName,
      type: 'message',
      status: 'error',
      message: result.message,
      errorCode: result.error,
      duration
    });

    return result;
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

/**
 * Retry com exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Falha após múltiplas tentativas');
}

/**
 * Interface para log de teste
 */
export interface TestLog {
  id: string;
  timestamp: string;
  instanceName: string;
  type: 'connection' | 'message';
  status: 'success' | 'error';
  message: string;
  errorCode?: string;
  duration: number; // em ms
}

/**
 * Gerenciador de logs de teste
 */
export class TestLogManager {
  private static readonly STORAGE_KEY = 'evolution_api_test_logs';
  private static readonly MAX_LOGS = 100;

  static addLog(log: Omit<TestLog, 'id' | 'timestamp'>): TestLog {
    const fullLog: TestLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    const logs = this.getLogs();
    logs.unshift(fullLog);
    
    // Manter apenas os últimos 100 logs
    if (logs.length > this.MAX_LOGS) {
      logs.pop();
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }

    return fullLog;
  }

  static getLogs(): TestLog[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erro ao recuperar logs:', error);
      return [];
    }
  }

  static getLogsByInstance(instanceName: string): TestLog[] {
    return this.getLogs().filter(log => log.instanceName === instanceName);
  }

  static clearLogs(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  }

  static clearOldLogs(days: number = 7): void {
    const logs = this.getLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = logs.filter(log => {
      return new Date(log.timestamp) > cutoffDate;
    });

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
    }
  }
}

/**
 * Testa múltiplas instâncias em paralelo
 */
export async function testMultipleInstances(
  configs: Array<{ name: string; config: EvolutionApiConfig }>
): Promise<Array<{ name: string; result: ConnectionTestResult; duration: number }>> {
  const results = await Promise.all(
    configs.map(async ({ name, config }) => {
      const startTime = Date.now();
      const result = await testEvolutionConnection(config);
      const duration = Date.now() - startTime;
      
      return { name, result, duration };
    })
  );

  return results;
}
