#!/bin/bash
# Script para instalar e fazer build da aplicação localmente

echo "🔧 Iniciando setup do projeto..."
echo ""

# 1. Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando PNPM..."
    npm install -g pnpm
fi

echo "✅ PNPM versão: $(pnpm --version)"
echo ""

# 2. Limpar lockfile antigo (opcional)
# echo "🧹 Limpando lock files antigos..."
# rm -f pnpm-lock.yaml

# 3. Instalar dependências workspace
echo "📥 Instalando dependências workspace..."
pnpm install

echo ""
echo "✅ Dependências instaladas!"
echo ""

# 4. Verificar tipos TypeScript
echo "🔍 Verificando tipos TypeScript..."
pnpm -r run type-check || echo "⚠️ Alguns tipos podem ter problemas"

echo ""
echo "✅ Setup concluído!"
echo ""
echo "🚀 Para começar:"
echo "   pnpm dev              # Rodar em desenvolvimento"
echo "   pnpm build            # Build completo"
echo "   pnpm --filter frontend dev  # Apenas frontend"
