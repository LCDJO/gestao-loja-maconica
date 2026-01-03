# 📱 Integrações de Sistema

Este diretório contém todas as integrações com serviços externos.

## 🗂️ Estrutura

```
integrations/
├── Dashboard.tsx                    ← Painel principal de integrações
├── IntegracoesFinanceiras/         ← Pagamentos, Pix, etc
├── IntegracoesAgendamento/         ← Google Calendar, Outlook, etc
├── IntegracoesNotificacoes/        ← OneSignal, Firebase, etc
├── IntegracoesArmazenamento/       ← Google Drive, AWS S3, etc
├── IntegracoesAnalytics/           ← Google Analytics, Umami, etc
├── IntegracoesRH/                  ← Guia de Pontos, Zoho, etc
├── IntegracoesErp/                 ← SAP, TOTVS, OpenERP, etc
└── index.ts                         ← Exports
```

## ✨ Categorias

### 🏦 Integrações Financeiras
- **Stripe** - Processamento de cartão de crédito
- **PagSeguro** - Pagamentos brasileiros
- **Pix** - Banco Central/PIX

### 📞 Integrações de Comunicação
- **WhatsApp Business** - Mensagens e notificações
- **Telegram** - Bot para comunicação
- **Email SMTP** - Serviços de email

### 🔔 Integrações de Notificações
- **OneSignal** - Push notifications
- **Firebase** - FCM para mobile
- **AWS SNS** - Amazon Simple Notification Service

### 📅 Integrações de Agendamento
- **Google Calendar** - Sincronização de eventos
- **Outlook** - Microsoft Calendar
- **Calendly** - Agendamento online

### 💾 Integrações de Armazenamento
- **Google Drive** - Armazenamento em nuvem
- **AWS S3** - Amazon S3 Buckets
- **Azure Blob** - Microsoft Azure Storage

### 📊 Integrações de Analytics
- **Google Analytics** - Rastreamento de usuários
- **Umami** - Analytics privado
- **Hotjar** - Heatmaps e recordings

### 👥 Integrações de RH
- **Guia de Pontos** - Controle de folha
- **Zoho Recruit** - Recrutamento

### 🗄️ Integrações ERP
- **SAP** - SAP ERP System
- **TOTVS** - Protheus/RM
- **OpenERP** - Odoo

## 🔐 Segurança

- Todas as credenciais são armazenadas com criptografia
- Variáveis de ambiente para sensíveis
- Logs de acesso para auditoria
- Revocar permissões a qualquer momento

## 📝 Como Adicionar Nova Integração

1. Crie uma pasta em `/integrações/{NomeCategoria}/{NomeIntegracao}`
2. Crie o arquivo de componente `{NomeIntegracao}.tsx`
3. Adicione export no `index.ts` da categoria
4. Atualize o Dashboard.tsx para incluir a nova integração
5. Documente em `README.md`

## 🚀 Rotas

- `/integracao/pagamentos` - Gerenciar pagamentos
- `/integracao/whatsapp` - Configurar WhatsApp
- `/integracao/onesignal` - Configurar push
- `/integracao/google-calendar` - Google Calendar
- `/integracao/google-drive` - Google Drive
- `/integracao/analytics` - Google Analytics
- `/integracao/guia-pontos` - Guia de Pontos
- `/integracao/erp` - Sistemas ERP
