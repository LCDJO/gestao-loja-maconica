# Lista de Tarefas - Expansão Financeira e Configurações

## Fase 7: Módulo de Configurações
- [ ] Criar página de Configurações (`/configuracoes`)
- [ ] Implementar aba de Integrações (Evolution API, GOWA)
- [ ] Implementar aba de Formas de Pagamento (PIX, Boleto, Cartão)
- [ ] Criar store para salvar configurações localmente

## Fase 8: Faturamento Avançado
- [ ] Atualizar tipos para suportar Eventos de Faturamento (Mútuas, Taxas)
- [ ] Criar interface para criar novo Evento de Faturamento
- [ ] Implementar geração de cobranças em lote para todos os membros ativos
- [ ] Atualizar página de Tesouraria para incluir gestão de cobranças geradas

## Fase 9: Cobrança via WhatsApp
- [ ] Adicionar botão de "Enviar Cobrança" na lista de mensalidades/taxas
- [ ] Criar modal de confirmação de envio (selecionar contato autorizado)
- [ ] Simular envio via API (feedback visual de sucesso)

## Fase 11: Conciliação Bancária
- [ ] Criar parser para arquivos OFX
- [ ] Implementar página de Conciliação Bancária
- [ ] Adicionar funcionalidade de upload de arquivo OFX
- [ ] Implementar matching automático entre transações OFX e cobranças
- [ ] Criar interface para revisar e confirmar baixas
- [ ] Adicionar histórico de conciliações


## Fase 13: Portal do Membro
- [ ] Criar contexto de autenticação (AuthContext)
- [ ] Implementar página de login com validação
- [ ] Criar página inicial do portal do membro
- [ ] Implementar visualização de pendências individuais
- [ ] Criar interface de histórico de pagamentos

## Fase 14: Geração de Segunda Via
- [ ] Implementar gerador de QR Code PIX
- [ ] Criar função de geração de segunda via de boleto
- [ ] Adicionar opção de download/compartilhamento
- [ ] Implementar simulação de envio por email/WhatsApp


## Fase 16: Notificações por Email
- [ ] Criar tipos para notificações de email
- [ ] Implementar store para histórico de notificações
- [ ] Criar página de configuração de notificações
- [ ] Implementar agendador de notificações automáticas
- [ ] Criar templates de email para diferentes cenários
- [ ] Implementar visualização de histórico de envios
- [ ] Adicionar testes de envio de email


## Fase 18: Preferências de Notificação do Membro
- [ ] Criar tipos para preferências de notificação do membro
- [ ] Implementar store para preferências do membro
- [ ] Criar página de configurações de notificação no portal do membro
- [ ] Adicionar toggles para email, push, WhatsApp e SMS
- [ ] Implementar validação de telefone/WhatsApp
- [ ] Salvar preferências no localStorage

## Fase 19: Integração OneSignal
- [ ] Criar tipos para configuração OneSignal
- [ ] Adicionar campos de configuração OneSignal no menu de Configurações
- [ ] Implementar SDK do OneSignal
- [ ] Criar função para registrar dispositivo no OneSignal
- [ ] Implementar envio de push notifications via OneSignal

## Fase 20: Integração OpenSign
- [ ] Criar tipos para documentos e assinaturas
- [ ] Adicionar campos de configuração OpenSign no menu de Configurações
- [ ] Implementar integração com API OpenSign
- [ ] Criar página de gerenciamento de documentos para assinatura
- [ ] Implementar fluxo de envio de documento para assinatura
- [ ] Adicionar histórico de assinaturas


## Fase 22: Módulo de Gerenciamento de Documentos
- [ ] Criar tipos para documentos e lotes de assinatura
- [ ] Implementar store para gerenciamento de documentos
- [ ] Criar página de upload e gerenciamento de documentos
- [ ] Implementar seleção de signatários para lote
- [ ] Criar interface de envio em lote para OpenSign
- [ ] Implementar rastreamento de status de assinatura
- [ ] Adicionar histórico de documentos assinados
- [ ] Criar templates de documentos padrão


## Fase 24: Dashboard de Analytics de Notificações
- [ ] Criar tipos para métricas de notificação
- [ ] Implementar store para analytics
- [ ] Criar página de dashboard de analytics
- [ ] Implementar gráficos de taxa de entrega por canal
- [ ] Implementar gráficos de taxa de abertura
- [ ] Implementar gráficos de cliques em links
- [ ] Adicionar filtros por período e tipo de cobrança
- [ ] Criar relatórios exportáveis

## Fase 25: Templates Customizáveis de Notificação
- [ ] Criar tipos para templates
- [ ] Implementar store para templates
- [ ] Criar página de gerenciamento de templates
- [ ] Implementar editor de templates com preview
- [ ] Adicionar suporte a upload de logo
- [ ] Implementar seletor de cores
- [ ] Criar templates padrão para cada tipo de cobrança
- [ ] Implementar variáveis dinâmicas (nome, valor, vencimento, etc)


## Fase 27: Agendamento de Campanhas com Testes A/B
- [ ] Criar tipos para campanhas e testes A/B
- [ ] Implementar store para campanhas
- [ ] Criar página de agendamento de campanhas
- [ ] Implementar seleção de templates para A/B
- [ ] Implementar agendamento de data/hora
- [ ] Criar interface de configuração de testes A/B
- [ ] Implementar simulação de envio em lote

## Fase 28: Webhooks de Rastreamento
- [ ] Criar tipos para eventos de webhook
- [ ] Implementar store para eventos de rastreamento
- [ ] Criar sistema de simulação de webhooks
- [ ] Implementar rastreamento de aberturas
- [ ] Implementar rastreamento de cliques
- [ ] Implementar rastreamento de conversões
- [ ] Atualizar analytics em tempo real

## Fase 29: Relatório de ROI
- [ ] Criar tipos para ROI
- [ ] Implementar cálculo de ROI por canal
- [ ] Criar página de relatório de ROI
- [ ] Implementar gráficos de conversão
- [ ] Implementar análise de arrecadação por canal
- [ ] Criar exportação de relatórios


## Fase 31: Arquitetura Multitenant
- [ ] Criar tipos para lojas e contexto multitenant
- [ ] Implementar store para lojas
- [ ] Criar contexto de loja ativa
- [ ] Implementar seletor de loja no header
- [ ] Adicionar isolamento de dados por loja

## Fase 32: Painel de Super Administrador
- [ ] Criar página de login de super admin
- [ ] Implementar dashboard de super admin
- [ ] Criar página de gestão de lojas
- [ ] Implementar CRUD de lojas
- [ ] Adicionar funcionalidades de ativar/desativar lojas
- [ ] Criar página de usuários do sistema

## Fase 33: Mensalidades de Aluguel
- [ ] Criar tipos para planos e mensalidades
- [ ] Implementar store para planos
- [ ] Criar página de gestão de planos
- [ ] Implementar sistema de cobrança de aluguel
- [ ] Adicionar histórico de pagamentos de aluguel

## Fase 34: Gestão Financeira
- [ ] Criar tipos para contatos financeiros
- [ ] Implementar store para contatos
- [ ] Criar página de gestão de contatos financeiros
- [ ] Implementar dashboard financeiro de super admin
- [ ] Adicionar relatórios de receita por loja
