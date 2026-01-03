# Script para instalar e fazer build da aplicação localmente (Windows PowerShell)

Write-Host "🔧 Iniciando setup do projeto..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se pnpm está instalado
$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpm) {
    Write-Host "📦 Instalando PNPM..." -ForegroundColor Yellow
    npm install -g pnpm
}

$version = & pnpm --version
Write-Host "✅ PNPM versão: $version" -ForegroundColor Green
Write-Host ""

# 2. Instalar dependências workspace
Write-Host "📥 Instalando dependências workspace..." -ForegroundColor Yellow
pnpm install

Write-Host ""
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""

# 3. Verificar tipos TypeScript
Write-Host "🔍 Verificando tipos TypeScript..." -ForegroundColor Yellow
pnpm -r run type-check

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para começar:" -ForegroundColor Cyan
Write-Host "   pnpm dev                    # Rodar em desenvolvimento" -ForegroundColor White
Write-Host "   pnpm build                  # Build completo" -ForegroundColor White
Write-Host "   pnpm --filter frontend dev  # Apenas frontend" -ForegroundColor White
