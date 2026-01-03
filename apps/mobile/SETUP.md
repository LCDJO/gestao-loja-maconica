# 📱 Guia de Setup - App Mobile React Native

**Status**: Pronto para Desenvolvimento  
**Versão**: 1.0.0  
**Data**: 3 de janeiro de 2026  

---

## 🎯 O que é este App?

App mobile multiplataforma (iOS + Android) para membros acessarem:

✅ **Portal do Irmão** - Perfil, dados pessoais  
✅ **Tesouraria** - Saldo, transações, boletos  
✅ **Secretaria** - Lista de membros, documentos  
✅ **Hospitalaria** - Status de saúde, membros em necessidade  
✅ **Presença** - Histórico de participação, próximos eventos  

---

## 📋 Pré-requisitos

### Sistema
```bash
- Node.js >= 18.0.0
- npm ou yarn
- Expo CLI: npm install -g expo-cli
```

### Mobile
```bash
iOS:
  - macOS 11+
  - Xcode 14+ (para build)
  - iOS 13+ (para deploy)

Android:
  - Android 8.0+ (API 26+)
  - Android Studio (opcional, para emulador)
```

---

## 🚀 Quick Start (5 minutos)

### 1. Instalar Dependências

```bash
cd apps/mobile
pnpm install
```

### 2. Configurar Ambiente

Criar arquivo `.env.local`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3002
EXPO_PUBLIC_ENV=development
```

### 3. Iniciar Dev Server

```bash
# Terminal 1: Backend (Members Service)
cd apps/backend/services/members
pnpm dev

# Terminal 2: App Mobile
cd apps/mobile
pnpm dev
```

### 4. Abrir no Expo Go

```bash
# Escanear QR Code com:
iOS: Camera app > escanear QR
Android: Expo Go app > escanear QR

# Ou conectar via USB
pnpm dev:ios      # iOS físico
pnpm dev:android  # Android físico
```

---

## 📁 Estrutura de Diretórios

```
apps/mobile/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── auth/           # Login, splash screen
│   │   ├── common/         # Botões, cards, etc
│   │   └── errors/         # Error boundary
│   │
│   ├── screens/            # Telas de navegação
│   │   ├── auth/           # Login, signup
│   │   ├── profile/        # Perfil do membro
│   │   ├── finances/       # Saldo, transações
│   │   ├── members/        # Lista de membros
│   │   ├── documents/      # Documentos
│   │   ├── attendance/     # Presença
│   │   ├── health/         # Status de saúde
│   │   └── settings/       # Configurações
│   │
│   ├── navigation/         # Estrutura de navegação
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── LinkingConfiguration.ts
│   │
│   ├── services/           # Serviços (API, storage, etc)
│   │   ├── api.ts          # Cliente HTTP
│   │   ├── storage.ts      # Armazenamento local
│   │   └── notifications.ts # Push notifications
│   │
│   ├── store/              # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── dataStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useData.ts      # Queries (React Query)
│   │   ├── useAuth.ts      # Auth logic
│   │   └── useDeepLink.ts  # Deep linking
│   │
│   ├── types/              # TypeScript types
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── navigation.ts
│   │
│   ├── utils/              # Funções utilitárias
│   │   ├── formatters.ts   # Format money, dates
│   │   ├── validators.ts   # Email, password
│   │   └── constants.ts    # Constantes
│   │
│   ├── assets/             # Imagens, ícones, fontes
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── App.tsx             # Ponto de entrada
│
├── app.json                # Config Expo
├── eas.json                # Config EAS Build (deploy)
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔐 Autenticação

### Fluxo de Login

```
1. Usuário abre app
   ↓
2. Tela de splash verifica se tem token armazenado
   ↓
3. Se tem token válido
   → Vai direto para Home
   
4. Se não tem ou token expirou
   → Mostra tela de Login
   
5. Usuário insere email + senha
   ↓
6. App chama POST /login
   ↓
7. Backend retorna tokens (access + refresh)
   ↓
8. App armazena tokens em SecureStore
   ↓
9. Navega para Home
```

### Tokens

- **Access Token**: JWT válido por 24 horas
- **Refresh Token**: JWT válido por 7 dias
- **Storage**: `SecureStore` (Keychain iOS, Keystore Android)

### Auto-refresh

Quando token expira:

```
1. Requisição retorna 401
   ↓
2. Interceptor detecta
   ↓
3. Usa refresh token para obter novo access token
   ↓
4. Reexecuta requisição original
   ↓
5. Se refresh token também expirou
   → Faz logout automático
```

---

## 📊 Estrutura de Dados

### Member Profile

```typescript
interface Member {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
    lodgeId: string;
    lodgeName: string;
  };
  member: {
    cim: string;              // ID na loja
    degree: string;           // Mestre, Companheiro, Aprendiz
    status: string;           // Ativo, Inativo, Irregular
    initiation_date: string;  // Data de iniciação
    birth_date: string;
    photo_url: string;
  };
}
```

### Transactions

```typescript
interface Transaction {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  status: 'pago' | 'pendente' | 'vencido';
}
```

### Members List

```typescript
interface ListMember {
  id: string;
  cim: string;
  name: string;
  email: string;
  degree: string;
  status: string;
  phone: string;
  photo_url?: string;
}
```

---

## 🛠️ Desenvolvimento

### Adicionar Nova Tela

1. **Criar componente em `screens/`**

```tsx
// src/screens/profile/ProfileScreen.tsx
import { View, Text } from 'react-native';
import { useProfile } from '@hooks/useData';

export function ProfileScreen() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar</Text>;

  return (
    <View>
      <Text>{data.data.user.name}</Text>
      <Text>{data.data.member.degree}</Text>
    </View>
  );
}
```

2. **Adicionar rota em `navigation/MainNavigator.tsx`**

```tsx
<Stack.Screen name="Profile" component={ProfileScreen} />
```

3. **Usar em outro lugar**

```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Profile');
```

### Acessar Dados com Hooks

```tsx
// Usar hook React Query para fetch automático
function MyComponent() {
  const { data, isLoading, error, refetch } = useTransactions(1, 20);

  return (
    <View>
      {isLoading && <Text>Carregando...</Text>}
      {error && <Text>Erro: {error.message}</Text>}
      {data && data.data.transactions.map(t => (
        <Text key={t.id}>{t.description}: R$ {t.amount}</Text>
      ))}
      <Button onPress={() => refetch()} title="Atualizar" />
    </View>
  );
}
```

### Autenticação

```tsx
import { useAuthStore } from '@store/authStore';

function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      // Navegar para Home
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleLogin} title="Login" />
    </View>
  );
}
```

---

## 📱 Teste em Dispositivo

### iOS

```bash
# Conectar iPhone via USB
# Confiar no computador no iPhone

# Opção 1: Expo Go
pnpm dev:ios

# Opção 2: Build local
pnpm prebuild      # Criar arquivos nativos
pnpm build:ios     # Compilar com EAS

# Opção 3: Xcode
pnpm prebuild
open ios/           # Abrir em Xcode
# Clicar Play para compilar e rodar
```

### Android

```bash
# Conectar Android via USB
# Ativar Developer Mode no telefone

# Opção 1: Expo Go
pnpm dev:android

# Opção 2: Emulador
pnpm dev:android
# Abrir emulador no Android Studio

# Opção 3: Build
eas build --platform android --local
```

---

## 🚀 Build para Publicação

### Preparação

1. **Criar conta EAS**

```bash
eas login
# Ou usar account existente
```

2. **Configurar `eas.json`**

```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "app-store"
      },
      "android": {
        "distribution": "play-store"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "asciiAppId": "1234567890"
      },
      "android": {
        "androidPackage": "com.masonica.gestao"
      }
    }
  }
}
```

### Build iOS para App Store

```bash
# 1. Criar certificados
eas credentials

# 2. Incrementar versão
# Editar app.json: "version": "1.0.1"

# 3. Build
eas build --platform ios --auto-submit

# Ou submeter manualmente depois
eas submit --platform ios
```

### Build Android para Play Store

```bash
# 1. Configurar assinatura
eas credentials

# 2. Build
eas build --platform android --auto-submit

# Ou submeter depois
eas submit --platform android
```

---

## 🔗 Deep Linking

### Configurar Deep Link

Quando alguém clica em `gestao-loja://member/profile/123`:

```
1. App abre (ou volta do background)
   ↓
2. Navega para: ProfileScreen com memberId=123
   ↓
3. Tela mostra dados do membro
```

### Exemplo: Push Notification

```json
{
  "title": "Novo Boleto",
  "body": "Mensalidade de Janeiro",
  "deepLink": "gestao-loja://finances/invoices"
}
```

---

## 📊 Offline Support

### Sincronização Local

O app pode funcionar offline com dados armazenados:

```tsx
// 1. Dados são cacheados automaticamente por React Query
// 2. SQLite local para sincronização

async function syncWhenOnline() {
  if (!navigator.onLine) return;

  const pending = await getPendingChanges();
  for (const change of pending) {
    try {
      await api.post('/sync', change);
      await markSynced(change.id);
    } catch (error) {
      // Marcar para retry
      await markPending(change.id);
    }
  }
}
```

---

## 🐛 Debugging

### Expo Dev Tools

```bash
# Abrir menu Expo
d (no web)
Shake device (no físico)
```

### Console Logs

```bash
# Ver logs em tempo real
pnpm dev
# Logs aparecerão no terminal
```

### Remote Debugging

```bash
# Conectar React DevTools
npm install -g react-devtools
react-devtools
# Abrir app → Shake → "Debug remote JS"
```

---

## 🆘 Troubleshooting

### Problema: "Cannot find module @services/api"

**Solução:**
```bash
# Verificar paths em tsconfig.json
# Rebuildar TypeScript
pnpm check
```

### Problema: Token inválido no app

**Solução:**
```bash
# Limpar cache e reinstalar
expo start -c

# Ou remover cache manualmente
rm -rf .expo node_modules
pnpm install
```

### Problema: App lento

**Solução:**
```bash
# 1. Habilitar Hermes engine (mais rápido)
# editar app.json: "jsEngine": "hermes"

# 2. Usar React.memo para componentes
# 3. Usar useMemo/useCallback

# 4. Profiler
npx expo@latest export --source-maps
```

### Problema: Falha ao conectar API

**Solução:**
```bash
# 1. Verificar se backend está rodando
curl http://localhost:3002/health

# 2. Ajustar EXPO_PUBLIC_API_URL em .env.local
# Para Android em emulador: http://10.0.2.2:3002
# Para iOS em emulador: http://localhost:3002

# 3. Verificar CORS no backend
```

---

## 📚 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| [src/services/api.ts](./src/services/api.ts) | Cliente HTTP com JWT |
| [src/store/authStore.ts](./src/store/authStore.ts) | Estado de autenticação |
| [src/hooks/useData.ts](./src/hooks/useData.ts) | Hooks React Query |
| [src/navigation/RootNavigator.tsx](./src/navigation/RootNavigator.tsx) | Estrutura de navegação |
| [app.json](./app.json) | Config do app |
| [eas.json](./eas.json) | Config de build/deploy |
| [.env.local](./.env.local) | Variáveis de ambiente |

---

## 📱 Testar em Produção (QA)

### Build Staging

```bash
# Criar versão para testes internos
eas build --platform ios --profile staging
# Compartilhar via link gerado
```

### Beta Testing

```bash
# iOS TestFlight
eas submit --platform ios --profile staging

# Android Play Store (Internal Testing)
eas submit --platform android --profile staging
```

---

## 🎓 Próximos Passos

- [ ] Implementar telas faltantes
- [ ] Adicionar offline support com SQLite
- [ ] Configurar push notifications
- [ ] Implementar deep linking completo
- [ ] Adicionar testes (Jest + React Native Testing Library)
- [ ] Setup CI/CD para builds automáticos
- [ ] Publicar nas app stores

---

## 📞 Suporte

**Documentação:**
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Query](https://tanstack.com/query)

**Issues:**
- GitHub: [gestao-loja-maconica](https://github.com/seu-usuario/gestao-loja-maconica)
- Email: dev@gestao-loja.com.br

---

**Última atualização**: 3 de janeiro de 2026  
**Mantido por**: Time de Desenvolvimento
