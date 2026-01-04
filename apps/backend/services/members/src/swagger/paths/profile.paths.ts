/**
 * Swagger Paths - Perfil do Membro
 * GET /api/members/profile
 * PUT /api/members/profile/update
 * PUT /api/members/password
 */

export const profilePaths = {
  '/api/members/profile': {
    get: {
      summary: 'Get Profile - Obter perfil do membro',
      description: 'Retorna o perfil completo do membro autenticado.',
      operationId: 'getProfile',
      tags: ['Perfil'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Perfil do membro',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UserProfile' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/profile/update': {
    put: {
      summary: 'Update Profile - Atualizar perfil',
      description:
        'Atualiza os dados de perfil do membro (nome, telefone, endereço, cidade).',
      operationId: 'updateProfile',
      tags: ['Perfil'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Perfil atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Perfil atualizado com sucesso',
                  },
                  data: { $ref: '#/components/schemas/UserProfile' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/password': {
    put: {
      summary: 'Change Password - Alterar senha',
      description:
        'Altera a senha do membro autenticado. Requer a senha atual para validação.',
      operationId: 'changePassword',
      tags: ['Perfil'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Senha alterada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
