# 🚀 Guia Completo - Publicação nas App Stores

**Status**: Passo a passo para publicação  
**Versão**: 1.0.0  
**Data**: 3 de janeiro de 2026

---

## 📋 Checklist Pré-Publicação

### Código & Funcionalidades
- [ ] Todas as telas implementadas
- [ ] Testes manuais em iOS e Android reais
- [ ] Sem erros de console
- [ ] Performance otimizada (< 3s de abertura)
- [ ] Tratamento de erros em todos os endpoints
- [ ] Offline support testado
- [ ] Deep linking funcionando

### Design & UX
- [ ] Ícones e splash screens criados (1024x1024, PNG)
- [ ] Interface responsiva em todos os tamanhos
- [ ] Temas claro/escuro testados
- [ ] Teclado virtual não cobre inputs
- [ ] Loading states implementados
- [ ] Empty states amigáveis

### Segurança
- [ ] Tokens armazenados em SecureStore (não AsyncStorage)
- [ ] SSL/TLS para todas as requisições
- [ ] Dados sensíveis não logueados
- [ ] Validação de entrada em formulários
- [ ] Rate limiting respeitado
- [ ] Permissions solicitadas corretamente

### Performance
- [ ] Bundle size < 50MB
- [ ] Imagens otimizadas (< 1MB cada)
- [ ] Lazy loading implementado
- [ ] React Query cache configurado
- [ ] Memória: < 100MB em repouso
- [ ] Bateria: teste 6+ horas em uso contínuo

### Metadata
- [ ] Descrição app clara (< 80 caracteres)
- [ ] Screenshots de boa qualidade (3-5 por idioma)
- [ ] Preview video (opcional mas recomendado)
- [ ] Terms of Service & Privacy Policy linkados
- [ ] Contact email correto

---

## 🍎 Publicação iOS (App Store)

### Passo 1: Preparar Certificados

```bash
# Criar account Apple Developer
https://developer.apple.com/account/

# Configurar com EAS
eas credentials

# Selecionar:
# ? How would you like to authenticate?
# → Apple ID with app-specific password

# ? Provide your Apple ID email:
# → seu-email@icloud.com

# ? Generate App Specific Password?
# → yes
# https://appleid.apple.com/ → Security → App-Specific Passwords
```

### Passo 2: App Store Connect

```bash
# 1. Abrir App Store Connect
https://appstoreconnect.apple.com/

# 2. Create App
# - Name: Gestão Loja Maçônica
# - Bundle ID: com.masonica.gestaoloja
# - SKU: gestao-loja-001
# - Primary Language: Portuguese (Brazil)

# 3. Preencher informações
# - Description: "Acesse dados da sua loja maçônica quando quiser"
# - Support URL: https://gestao-loja.com.br/help
# - Privacy Policy URL: https://gestao-loja.com.br/privacy

# 4. Informações de Preço e Distribuição
# - Free
# - Maçônica do Brasil, Maçônica Brasil

# 5. General
# - App Icon: 1024x1024 PNG
# - Minimum OS Version: iOS 13.0
```

### Passo 3: Screenshots & Metadata

```bash
# App Store exige screenshots para cada idioma

Dimensões:
- iPhone: 1170 x 2532 px
- iPad: 2048 x 2732 px (opcional)

Screenshots recomendados (em ordem):
1. Tela de login
2. Perfil do membro
3. Saldo financeiro
4. Lista de membros
5. Configurações
```

### Passo 4: Build para TestFlight (Testes Internos)

```bash
# 1. Incrementar versão
# app.json:
# "version": "1.0.0"

# 2. Build para produção
eas build --platform ios --profile production

# 3. Será enviado automaticamente para TestFlight

# 4. Adicionar testadores
# App Store Connect → TestFlight → Internal Testers
# Adicionar Apple IDs

# 5. Testers baixam app via TestFlight
https://apps.apple.com/br/app/testflight/id899247664
```

### Passo 5: Submit para App Store

```bash
# Opção A: Auto-submit durante build
eas build --platform ios --auto-submit

# Opção B: Submit manual depois
eas build --platform ios
eas submit --platform ios

# Será solicitado:
# - Apple ID
# - Password (app-specific)
# - AASA (App Store API Key)

# Avaliação levará 24-48 horas
```

### Checklist App Store

- [ ] App Icon 1024x1024 (sem arredondamento)
- [ ] Screenshots em português (recomendado)
- [ ] Privacy Policy URL válida
- [ ] Support URL válida
- [ ] Versão > 1.0.0
- [ ] Build number incrementado
- [ ] Certificados assinados
- [ ] Notarization completo

---

## 🤖 Publicação Android (Play Store)

### Passo 1: Google Play Account

```bash
# 1. Criar conta Google Play Developer
# https://play.google.com/console/
# Pagar taxa: $25 (única vez)

# 2. Criar projeto
# - App name: Gestão Loja Maçônica
# - Default language: Portuguese (Brazil)
# - App or game: App
# - Free or paid: Free

# 3. Configurar informações do app
# - Short description: "Gestor da loja maçônica"
# - Full description: "Acesse seus dados da loja..."
# - Category: Productivity
```

### Passo 2: Assinatura (Signing Key)

```bash
# EAS gerencia automaticamente, mas você pode criar manual:

# 1. Gerar keystore
keytool -genkey -v -keystore gestao-loja.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias gestao-loja-key

# 2. Configurar em eas.json
{
  "build": {
    "production": {
      "android": {
        "keystore": {
          "keystorePath": "gestao-loja.keystore",
          "keystorePassword": "sua-senha",
          "keyAlias": "gestao-loja-key",
          "keyPassword": "sua-senha"
        }
      }
    }
  }
}

# 3. Guardar keystore em local seguro!
# Perder = não poder atualizar o app
```

### Passo 3: Screenshots & Metadata

```bash
# Play Store exige screenshots em múltiplos idiomas

Dimensões:
- Landscape: 1280 x 720 px
- Portrait: 1440 x 3120 px (ou 1080 x 1920)

Screenshots recomendados:
1. Login com touch ID
2. Perfil e dados pessoais
3. Extrato de transações
4. Boletos em aberto
5. Presença e eventos

Ícone da app: 512x512 PNG
Feature graphic: 1024x500 PNG
```

### Passo 4: Build para Internal Testing

```bash
# 1. Build local para testes
eas build --platform android --profile preview

# 2. Download da APK
# Link fornecido ao final do build

# 3. Instalar em Android
adb install app-release.apk

# 4. Testar completo
# - Login/Logout
# - Todas as telas
# - Offline mode
# - Push notifications
```

### Passo 5: Build de Produção

```bash
# Build otimizado com minificação
eas build --platform android --profile production

# Será gerado AAB (Android App Bundle)
# Ideal para Play Store (menores downloads)
```

### Passo 6: Upload para Play Store

```bash
# Opção A: Auto-submit
eas build --platform android --auto-submit

# Opção B: Manual
# 1. Ir para Google Play Console
# 2. Criar novo release
# 3. Upload do AAB gerado
# 4. Adicionar notas de lançamento em português
# 5. Clicar "Review" depois "Publish"

# Aprovação: 24-48 horas
```

### Configuração Play Store

- [ ] Ícone 512x512
- [ ] Screenshots em português
- [ ] Short description < 50 caracteres
- [ ] Full description < 4000 caracteres
- [ ] Category correta
- [ ] Privacy policy linkada
- [ ] Contact email funcional
- [ ] AAB assinado
- [ ] Version code incrementado

---

## 📱 Versões & Updates

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0
^   ^ ^
|   | └─ Patch (bugfixes): 1.0.1, 1.0.2
|   └─── Minor (features): 1.1.0, 1.2.0
└─────── Major (breaking): 2.0.0
```

### Versionamento Automático

```bash
# app.json
"version": "1.0.0",

# ios: buildNumber = patch version
"buildNumber": "1"

# android: versionCode (deve ser maior que anterior)
"versionCode": 1  # 2, 3, 4, ...

# Exemplo: atualizar de 1.0.0 para 1.0.1
# app.json: "version": "1.0.1"
# iOS: "buildNumber": "2"
# Android: "versionCode": 2
```

### Checklist de Release

```bash
# 1. Testar em ambos os aparelhos
pnpm dev:ios
pnpm dev:android

# 2. Testar em produção (simulator/emulator)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# 3. Incrementar versão
# app.json: version e buildNumber

# 4. Commit & tag
git add app.json
git commit -m "Release v1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"

# 5. Build de produção
eas build --platform ios --auto-submit
eas build --platform android --auto-submit

# 6. Monitor aprovação (1-2 dias)
# App Store Connect → iOS
# Google Play Console → Android
```

---

## 🔄 OTA Updates (Over-the-Air)

### Expo Updates

```bash
# Atualizar app sem ir pela app store

# 1. Configurar em app.json (já vem padrão)
"updates": {
  "url": "https://u.expo.dev/seu-project-id"
}

# 2. Fazer update
expo publish

# 3. Usuários recebem atualização próxima vez que abrem

# Tipos de updates:
# - JS Bundle: nova lógica (rápido)
# - Native changes: requer nova build para store
```

### Quando Usar OTA

```
✅ Use OTA para:
- Bugfixes no JavaScript
- Ajustes de UI
- Mensagens atualizadas
- Ajustes de API

❌ Não use OTA para:
- Mudanças em permissões
- Novos módulos nativos
- Atualizar Expo SDK
- Mudanças de icones/splash
```

### Exemplo: Publicar Update

```bash
# 1. Fazer mudanças no código
# src/screens/ProfileScreen.tsx

# 2. Incrementar versão (patch)
# app.json: "version": "1.0.1"

# 3. Publicar
expo publish

# ✅ Próxima vez que usuários abrem, recebem atualização

# Ver histórico
expo publish:history
```

---

## 📊 Analytics & Monitoring

### Firebase Setup (Recomendado)

```bash
# 1. Criar projeto Firebase
# https://console.firebase.google.com/

# 2. Instalar SDK
npm install firebase react-native-firebase @react-native-firebase/analytics

# 3. Configurar em app.tsx
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIza...",
  projectId: "gestao-loja-...",
  // ... etc
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

# 4. Track eventos
analytics.logEvent('member_login', {
  lodgeId: user.lodgeId,
  degree: user.degree
});
```

### Métricas Importantes

```
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Retention (% que voltam em 7 dias)
- Crash rate (bugs não detectados)
- Session duration
- Top screens
- Erros mais frequentes
```

---

## 🚨 Troubleshooting Publicação

### iOS Rejeição Comum

```
❌ "Apps that access health data must have privacy policy"
✅ Adicionar Privacy Policy URL em App Store Connect

❌ "Guideline 2.1 - App Completeness"
✅ Não deixar links quebrados, testar todas as features

❌ "Guideline 3.1.2 - Unacceptable"
✅ Remover links externos (levar para deep link interno)
```

### Android Rejeição Comum

```
❌ "App crashes on startup"
✅ Testar em múltiplos aparelhos, verificar logs

❌ "App requires undeclared permissions"
✅ Adicionar em app.json → android.permissions

❌ "Spam or low-quality content"
✅ Descrição genérica = rejeição. Detalhar features
```

---

## 📞 Suporte Pós-Publicação

### Monitorar Ratings

```bash
# App Store
https://appstoreconnect.apple.com/ → Analytics

# Play Store
https://play.google.com/console/ → User reviews

# Responder comentários negativos em 24h
```

### Patching Urgentes

```bash
# Se descobrir bug crítico após publicação

# 1. Fixar código
# 2. Incrementar versão patch
# app.json: "version": "1.0.1"

# 3. Build & submit
eas build --platform ios --auto-submit
eas build --platform android --auto-submit

# Apple: 24h
# Google: 2-4h
```

---

## ✅ Checklist Final

```
PRÉ-PUBLICAÇÃO:
☐ Todas features testadas
☐ Sem erros em console
☐ Offline funciona
☐ Performance OK

ASSETS:
☐ Ícones 1024x1024 (iOS), 512x512 (Android)
☐ Screenshots 3-5 para cada idioma
☐ Splash screen criado

METADATA:
☐ Descrição clara em português
☐ Privacy Policy URL válida
☐ Support URL válida
☐ Version incrementado

CÓDIGO:
☐ Certificados gerados
☐ Build de produção feito
☐ Testado em aparelho real

SUBMISSÃO:
☐ Assets enviados
☐ Metadados preenchidos
☐ Build enviada
☐ Pronto para review

PÓS-PUBLICAÇÃO:
☐ Monitorar status
☐ Responder reviews
☐ Analytics configurado
```

---

**Duração esperada**: 1-2 semanas (review stores)  
**Próximo passo**: Monitorar aprovação e ratings  
**Contato**: dev@gestao-loja.com.br
