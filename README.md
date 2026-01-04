# 🧭 Sistema de Gestão Integrada

<p align="center">
  <img src="" alt="Logo Esquadro e Compasso" width="180"/>
</p>

## 📘 Sobre o Projeto

Este repositório contém um **Sistema de Gestão Integrada**, desenvolvido com foco em organização, controle administrativo e padronização de processos.

A identidade do projeto é representada pelo **esquadro e compasso**, simbolizando:
- Ordem
- Planejamento
- Equilíbrio
- Evolução contínua

O sistema é modular, permitindo expansão futura e integração entre áreas.

---

## 🎯 Estrutura: Admin vs Super-Admin

**⚠️ IMPORTANTE**: Este sistema tem **dois painéis de administração** completamente distintos:

| Painel | Escopo | Quem Acessa | Dados |
|--------|--------|-----------|-------|
| **👨‍💼 ADMIN** | Administra **UMA loja** maçônica | Secretário, Tesoureiro, Presidente | Isolado por loja |
| | `/admin/*` | | Apenas sua loja |
| **👑 SUPER-ADMIN** | Administra **TODO O SaaS** | Proprietário, Suporte | Sem isolamento |
| | `/admin/super-admin/*` | Operações SaaS | Todas as lojas |

📖 **[ADMIN_VS_SUPERADMIN.md](./ADMIN_VS_SUPERADMIN.md)** - Leia primeiro para entender a arquitetura!  
📖 **[MAPA_NAVEGACAO_PAINEIS.md](./MAPA_NAVEGACAO_PAINEIS.md)** - Mapa visual dos dois painéis

---

## 🧩 Módulos do Sistema

Atualmente, o sistema é composto pelos seguintes módulos:

- **📋 Secretaria**  
  Gestão administrativa, cadastros, documentos, atas e controle organizacional.

- **🏥 Hospitalaria**  
  Controle de atendimentos, registros operacionais, acompanhamento e relatórios.

- **💰 Tesouraria**  
  Gestão financeira, entradas e saídas, contribuições, relatórios e auditoria.

---

## 🚀 Objetivos

- Centralizar informações em um único sistema
- Garantir transparência e rastreabilidade
- Facilitar a gestão operacional e financeira
- Permitir evolução modular do projeto

---

## � App Mobile

**NOVO!** Seu app mobile React Native está pronto para começar.

- ✅ Backend otimizado para mobile (15+ APIs)
- ✅ Projeto Expo com React Native 0.73
- ✅ Cliente HTTP com JWT automático
- ✅ State management + Data caching
- ✅ 11 guias de documentação

**Começar em 5 minutos:**
```bash
cd apps/mobile && pnpm install && pnpm dev
```

👉 **[START_HERE.md](./START_HERE.md)** - Guia rápido de início (5 min)  
👉 **[CHECKLIST_RAPIDO.md](./CHECKLIST_RAPIDO.md)** - Próximos passos estruturados  
👉 **[apps/mobile/EXAMPLE_SCREEN.tsx](./apps/mobile/EXAMPLE_SCREEN.tsx)** - Template pronto para copiar  
👉 **[apps/mobile/PUBLICATION_GUIDE.md](./apps/mobile/PUBLICATION_GUIDE.md)** - Publicar App Store/Play Store  

---

## 🛠️ Tecnologias

**Frontend Web:**
- React 19
- Vite
- TypeScript 5.7
- Tailwind CSS 4

**Frontend Mobile:**
- React Native 0.73
- Expo 50
- Zustand (state)
- React Query (data)

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL
- JWT (jose)

**Database:**
- PostgreSQL 16
- Multitenant architecture
- Redis (caching)
- Frontend: Web responsivo
- Autenticação e controle de acesso por módulos

---

## 📂 Estrutura do Repositório

```bash
/
├── secretaria/
├── hospitalaria/
├── tesouraria/
├── docs/
│   └── logo-esquadro-compasso.png
└── README.md
