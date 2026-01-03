import { Request, Response } from 'express';
import {
  MemberProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../types';
import {
  findMemberById,
  updateMember,
  updateMemberPassword,
  getProfileWithoutPassword,
} from '../database';
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../schemas';

export async function getProfile(
  req: Request,
  res: Response<ApiResponse<MemberProfile>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const member = findMemberById(req.memberId);

    if (!member) {
      res.status(404).json({
        success: false,
        error: 'Perfil não encontrado',
      });
      return;
    }

    const profile = getProfileWithoutPassword(member);

    res.json({
      success: true,
      message: 'Perfil carregado com sucesso',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter perfil',
    });
  }
}

export async function updateProfile(
  req: Request,
  res: Response<ApiResponse<MemberProfile>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
      return;
    }

    const updates = validation.data as UpdateProfileRequest;

    const updatedMember = updateMember(req.memberId, updates);

    if (!updatedMember) {
      res.status(404).json({
        success: false,
        error: 'Perfil não encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updatedMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar perfil',
    });
  }
}

export async function changePassword(
  req: Request,
  res: Response<ApiResponse<null>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const validation = changePasswordSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
      return;
    }

    const { currentPassword, newPassword } = validation.data as ChangePasswordRequest;

    const member = findMemberById(req.memberId);

    if (!member) {
      res.status(404).json({
        success: false,
        error: 'Perfil não encontrado',
      });
      return;
    }

    // Verificar senha atual (em produção, usar bcrypt)
    if (member.password !== currentPassword) {
      res.status(401).json({
        success: false,
        error: 'Senha atual incorreta',
      });
      return;
    }

    // Atualizar senha
    const success = updateMemberPassword(req.memberId, newPassword);

    if (!success) {
      res.status(400).json({
        success: false,
        error: 'Erro ao atualizar senha',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao alterar senha',
    });
  }
}
