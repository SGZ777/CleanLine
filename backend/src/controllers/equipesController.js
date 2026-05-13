import prisma from '../../prisma/client.js';

export async function getEquipes(_req, res) {
  try {
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
        'Sem funcionarios',
      Setores:
        equipe.Setores.map((setor) => setor.Nome).join(', ') || 'Sem setores',
      TotalFuncionarios: equipe.Funcionarios.length,
      TotalSetores: equipe.Setores.length,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Erro no GET /equipes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createEquipe(req, res) {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome da equipe e obrigatorio' });
    }

    const equipe = await prisma.equipe_Limpeza.create({
      data: { Nome: nome },
    });

    return res.status(201).json({
      message: 'Equipe criada com sucesso',
      equipe: {
        id: equipe.Id,
        Nome: equipe.Nome,
        Funcionarios: 'Sem funcionarios',
        Setores: 'Sem setores',
        TotalFuncionarios: 0,
        TotalSetores: 0,
      },
      id: equipe.Id,
    });
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateEquipe(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  if (!id || !nome) {
    return res.status(400).json({ error: 'ID e nome da equipe sao obrigatorios' });
  }

  try {
    const updated = await prisma.equipe_Limpeza.update({
      where: { Id: parseInt(id) },
      data: { Nome: nome },
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
      message: 'Equipe atualizada com sucesso',
      equipe: {
        id: updated.Id,
        Nome: updated.Nome,
        Funcionarios:
          updated.Funcionarios.map((funcionario) => funcionario.Nome).join(', ') ||
          'Sem funcionarios',
        Setores:
          updated.Setores.map((setor) => setor.Nome).join(', ') || 'Sem setores',
        TotalFuncionarios: updated.Funcionarios.length,
        TotalSetores: updated.Setores.length,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Equipe nao encontrada' });
    }

    console.error('Erro ao atualizar equipe:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteEquipe(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID da equipe e obrigatorio' });
  }

  try {
    const funcionarios = await prisma.func_Limpeza.count({
      where: {
        Id_Equipe: parseInt(id),
        status: 'ativo',
      },
    });

    const setores = await prisma.setor.count({
      where: { Id_Limp: parseInt(id) },
    });

    if (funcionarios > 0 || setores > 0) {
      return res.status(409).json({
        error:
          'Nao e possivel excluir esta equipe porque existem funcionarios ou setores vinculados a ela',
      });
    }

    await prisma.equipe_Limpeza.delete({
      where: { Id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Equipe excluida com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Equipe nao encontrada' });
    }

    console.error('Erro ao excluir equipe:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
