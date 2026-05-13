import prisma from '../../prisma/client.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { validateString, validateId } from '../utils/validators.js';
import { sanitizeString } from '../utils/sanitizers.js';

/**
 * GET /api/equipes
 * Retorna todas as equipes com seus funcionários e setores
 */
export const getEquipes = asyncHandler(async (_req, res) => {
  const equipes = await prisma.equipe_Limpeza.findMany({
    include: {
      Funcionarios: {
        where: { status: 'ativo' },
        select: { id: true, Nome: true },
      },
      Setores: {
        select: { id: true, Nome: true },
      },
    },
    orderBy: { Nome: 'asc' },
  });

  const formatted = equipes.map((equipe) => ({
    id: equipe.Id,
    Nome: equipe.Nome,
    Funcionarios:
      equipe.Funcionarios.map((funcionario) => funcionario.Nome).join(', ') ||
      'Sem funcionários',
    Setores:
      equipe.Setores.map((setor) => setor.Nome).join(', ') || 'Sem setores',
    TotalFuncionarios: equipe.Funcionarios.length,
    TotalSetores: equipe.Setores.length,
  }));

  return res.status(200).json({
    success: true,
    data: formatted,
    total: formatted.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/equipes
 * Cria uma nova equipe
 */
export const createEquipe = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  // Validação
  const validation = validateString(nome, {
    minLength: 2,
    maxLength: 100,
    fieldName: 'Nome da equipe',
  });

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
      timestamp: new Date().toISOString(),
    });
  }

  // Sanitização
  const sanitizedNome = sanitizeString(nome);

  // Criação
  const equipe = await prisma.equipe_Limpeza.create({
    data: { Nome: sanitizedNome },
    select: { Id: true, Nome: true },
  });

  return res.status(201).json({
    success: true,
    message: 'Equipe criada com sucesso',
    data: {
      id: equipe.Id,
      Nome: equipe.Nome,
      Funcionarios: 'Sem funcionários',
      Setores: 'Sem setores',
      TotalFuncionarios: 0,
      TotalSetores: 0,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * PUT /api/equipes/:id
 * Atualiza uma equipe existente
 */
export const updateEquipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  // Validação de ID
  const idVal = validateId(id);
  if (!idVal.valid) {
    return res.status(400).json({
      error: 'ID inválido',
      timestamp: new Date().toISOString(),
    });
  }

  // Validação de nome
  const validation = validateString(nome, {
    minLength: 2,
    maxLength: 100,
    fieldName: 'Nome da equipe',
  });

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error,
      timestamp: new Date().toISOString(),
    });
  }

  // Sanitização
  const sanitizedNome = sanitizeString(nome);

  // Atualização
  const updated = await prisma.equipe_Limpeza.update({
    where: { Id: idVal.value },
    data: { Nome: sanitizedNome },
    include: {
      Funcionarios: {
        where: { status: 'ativo' },
        select: { id: true, Nome: true },
      },
      Setores: {
        select: { id: true, Nome: true },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Equipe atualizada com sucesso',
    data: {
      id: updated.Id,
      Nome: updated.Nome,
      Funcionarios:
        updated.Funcionarios.map((funcionario) => funcionario.Nome).join(', ') ||
        'Sem funcionários',
      Setores:
        updated.Setores.map((setor) => setor.Nome).join(', ') || 'Sem setores',
      TotalFuncionarios: updated.Funcionarios.length,
      TotalSetores: updated.Setores.length,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * DELETE /api/equipes/:id
 * Deleta uma equipe (verifica dependências primeiro)
 */
export const deleteEquipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validação de ID
  const idVal = validateId(id);
  if (!idVal.valid) {
    return res.status(400).json({
      error: 'ID inválido',
      timestamp: new Date().toISOString(),
    });
  }

  // Verifica dependências
  const [funcionariosCount, setoresCount] = await Promise.all([
    prisma.func_Limpeza.count({
      where: {
        Id_Equipe: idVal.value,
        status: 'ativo',
      },
    }),
    prisma.setor.count({
      where: { Id_Limp: idVal.value },
    }),
  ]);

  if (funcionariosCount > 0 || setoresCount > 0) {
    return res.status(409).json({
      error: 'Não é possível deletar equipe com funcionários ou setores vinculados',
      details: {
        funcionariosAtivos: funcionariosCount,
        setores: setoresCount,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Deleção
  await prisma.equipe_Limpeza.delete({
    where: { Id: idVal.value },
  });

  return res.status(200).json({
    success: true,
    message: 'Equipe deletada com sucesso',
    timestamp: new Date().toISOString(),
  });
});
