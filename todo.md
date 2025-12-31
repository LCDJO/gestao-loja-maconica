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
