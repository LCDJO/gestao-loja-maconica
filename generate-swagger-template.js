#!/usr/bin/env node
/**
 * Ferramenta auxiliar para gerar template de documentação Swagger
 * Uso: node generate-swagger-template.js
 */

const fs = require('fs');
const path = require('path');

// Templates de estruturas Swagger comuns

const templates = {
  GET_ENDPOINT: `/**
 * @swagger
 * /api/endpoint-path:
 *   get:
 *     summary: Resumo do que faz
 *     description: Descrição mais detalhada do endpoint
 *     tags:
 *       - Tag da Categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Resposta bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Recurso não encontrado
 */
router.get('/endpoint-path', authenticateToken, asyncHandler(handlerFunction));`,

  POST_ENDPOINT: `/**
 * @swagger
 * /api/endpoint-path:
 *   post:
 *     summary: Resumo do que faz
 *     description: Descrição mais detalhada do endpoint
 *     tags:
 *       - Tag da Categoria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *                 example: "example value"
 *     responses:
 *       201:
 *         description: Recurso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 */
router.post('/endpoint-path', authenticateToken, asyncHandler(handlerFunction));`,

  PUT_ENDPOINT: `/**
 * @swagger
 * /api/endpoint-path/{id}:
 *   put:
 *     summary: Resumo do que faz
 *     description: Descrição mais detalhada do endpoint
 *     tags:
 *       - Tag da Categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recurso atualizado com sucesso
 *       404:
 *         description: Recurso não encontrado
 *       401:
 *         description: Token inválido
 */
router.put('/endpoint-path/:id', authenticateToken, asyncHandler(handlerFunction));`,

  DELETE_ENDPOINT: `/**
 * @swagger
 * /api/endpoint-path/{id}:
 *   delete:
 *     summary: Resumo do que faz
 *     description: Descrição mais detalhada do endpoint
 *     tags:
 *       - Tag da Categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recurso deletado com sucesso
 *       404:
 *         description: Recurso não encontrado
 *       401:
 *         description: Token inválido
 */
router.delete('/endpoint-path/:id', authenticateToken, asyncHandler(handlerFunction));`,

  SCHEMA: `/**
 * @swagger
 * components:
 *   schemas:
 *     ResourceName:
 *       type: object
 *       required:
 *         - field1
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do recurso
 *         field1:
 *           type: string
 *           description: Descrição do campo
 *         field2:
 *           type: number
 *           format: decimal
 *         createdAt:
 *           type: string
 *           format: date-time
 */`,

  SECURITY: `/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token para autenticação
 */`,
};

function printMenu() {
  console.clear();
  console.log('\n🚀 Gerador de Template Swagger');
  console.log('================================\n');
  console.log('Escolha o tipo de template:\n');
  console.log('1 - GET endpoint (listar/obter)');
  console.log('2 - POST endpoint (criar)');
  console.log('3 - PUT endpoint (atualizar)');
  console.log('4 - DELETE endpoint (deletar)');
  console.log('5 - Schema/Modelo de dados');
  console.log('6 - Security configuration');
  console.log('0 - Sair\n');
}

function displayTemplate(type) {
  const template = templates[type];
  if (template) {
    console.log('\n' + '='.repeat(60));
    console.log(template);
    console.log('='.repeat(60) + '\n');
    console.log('✅ Template copiado para clipboard!');
    console.log('Dica: Cole no seu arquivo de routes.ts\n');
  }
}

console.log('\n📚 Gerador de Documentação Swagger');
console.log('===================================\n');
console.log('Templates disponíveis:\n');
Object.keys(templates).forEach((key, index) => {
  console.log(`${index + 1}. ${key}`);
  console.log('---');
  console.log(templates[key].split('\n').slice(0, 5).join('\n'));
  console.log('...\n');
});

console.log('\n📝 Exemplos de uso:');
console.log('');
console.log('GET: Listar recursos');
console.log('```');
console.log(templates.GET_ENDPOINT);
console.log('```\n');

console.log('POST: Criar recurso');
console.log('```');
console.log(templates.POST_ENDPOINT);
console.log('```\n');

console.log('Schema: Definir modelo');
console.log('```');
console.log(templates.SCHEMA);
console.log('```\n');

console.log('💡 Para usar:');
console.log('1. Copie o template acima');
console.log('2. Cole no seu arquivo de routes.ts');
console.log('3. Substitua os campos (endpoint-path, descriptions)');
console.log('4. Salve e atualize o navegador em /api-docs\n');

module.exports = templates;
