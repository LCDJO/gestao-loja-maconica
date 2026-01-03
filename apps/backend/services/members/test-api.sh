#!/bin/bash
# Script para testar o Members Service

echo "🚀 Iniciando testes do Members Service..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3002/api/members"

echo -e "${BLUE}📋 Teste 1: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@masonica.org","password":"senha123456"}')

echo "$LOGIN_RESPONSE" | jq .

# Extrair token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}✅ Login bem-sucedido!${NC}"
  echo "Token: $TOKEN"
  echo ""

  echo -e "${BLUE}📋 Teste 2: Get Profile${NC}"
  curl -s -X GET "$BASE_URL/profile" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""

  echo -e "${BLUE}📋 Teste 3: Get Balance${NC}"
  curl -s -X GET "$BASE_URL/finances/balance" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""

  echo -e "${BLUE}📋 Teste 4: Get Transactions${NC}"
  curl -s -X GET "$BASE_URL/finances/transactions" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""

  echo -e "${BLUE}📋 Teste 5: Update Profile${NC}"
  curl -s -X PUT "$BASE_URL/profile/update" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"João Updated","phone":"(21) 99999-8888"}' | jq .
  echo ""

  echo -e "${BLUE}📋 Teste 6: Verify Token${NC}"
  curl -s -X GET "$BASE_URL/verify" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""

  echo -e "${BLUE}📋 Teste 7: Logout${NC}"
  curl -s -X POST "$BASE_URL/logout" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""

  echo -e "${GREEN}✅ Todos os testes completados!${NC}"
else
  echo -e "${RED}❌ Erro no login${NC}"
fi
