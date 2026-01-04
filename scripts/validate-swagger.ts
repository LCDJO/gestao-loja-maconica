/**
 * Swagger Validation Script
 * Valida especificação OpenAPI antes de fazer commit
 *
 * Uso:
 * pnpm validate-swagger
 * pnpm validate-swagger --service members
 */

import SwaggerParser from '@apidevtools/swagger-parser';
import * as fs from 'fs';
import * as path from 'path';

const SERVICES = ['members', 'auth', 'finances', 'communications', 'audit'];
const serviceName = process.argv[3] || '';

async function validateService(service: string) {
  const specPath = path.join(
    __dirname,
    `../services/${service}/src/swagger/spec.json`
  );

  if (!fs.existsSync(specPath)) {
    console.warn(`⚠️  ${service}: spec.json não encontrado em ${specPath}`);
    return false;
  }

  try {
    console.log(`🔍 Validando ${service}...`);
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
    const api = await SwaggerParser.validate(spec);

    // Validações adicionais
    const errors: string[] = [];

    // 1. Verificar paths
    if (!api.paths || Object.keys(api.paths).length === 0) {
      errors.push('❌ Nenhum path definido');
    }

    // 2. Verificar schemas
    if (!api.components?.schemas || Object.keys(api.components.schemas).length === 0) {
      errors.push('⚠️  Nenhum schema definido (pode estar ok se usar $ref apenas)');
    }

    // 3. Validar operationIds únicos
    const operationIds = new Set<string>();
    const duplicates: string[] = [];

    for (const [path, pathItem] of Object.entries(api.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        const opId = (operation as any).operationId;
        if (opId) {
          if (operationIds.has(opId)) {
            duplicates.push(`${method.toUpperCase()} ${path} (operationId: ${opId})`);
          }
          operationIds.add(opId);
        }
      }
    }

    if (duplicates.length > 0) {
      errors.push(`❌ operationIds duplicados: ${duplicates.join(', ')}`);
    }

    // 4. Validar responses
    for (const [path, pathItem] of Object.entries(api.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        const responses = (operation as any).responses;
        if (!responses || Object.keys(responses).length === 0) {
          errors.push(
            `❌ ${method.toUpperCase()} ${path}: nenhuma response definida`
          );
        }
      }
    }

    if (errors.length > 0) {
      console.error(`\n❌ ${service} - FALHOU`);
      errors.forEach(e => console.error(`   ${e}`));
      return false;
    }

    console.log(`✅ ${service} - VÁLIDO`);
    console.log(
      `   - Paths: ${Object.keys(api.paths).length}`
    );
    console.log(
      `   - Schemas: ${Object.keys(api.components?.schemas || {}).length}`
    );
    console.log(`   - OperationIds: ${operationIds.size}`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${service} - ERRO`);
    console.error(`   ${(error as Error).message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Validando Swagger Specifications\n');

  const services = serviceName ? [serviceName] : SERVICES;
  const results: { service: string; valid: boolean }[] = [];

  for (const service of services) {
    const valid = await validateService(service);
    results.push({ service, valid });
    console.log();
  }

  const allValid = results.every(r => r.valid);
  const validCount = results.filter(r => r.valid).length;

  console.log(`\n📊 RESUMO: ${validCount}/${results.length} serviços válidos`);

  if (!allValid) {
    process.exit(1);
  }
}

main().catch(console.error);
