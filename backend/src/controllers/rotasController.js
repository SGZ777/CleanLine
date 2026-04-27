import prisma from '../../prisma/client.js';

export async function getRotas(_req, res) {
  try {
    const rotas = await prisma.rota.findMany({
      include: {
        Adm: { select: { Nome: true } },
        Setores: {
          include: { Setor: { select: { Nome: true } } },
        },
      },
      orderBy: { Nome_Rota: 'asc' },
    });

    const formatted = rotas.map(r => ({
      id: r.id,
      Nome: r.Nome_Rota,
      Administrador: r.Adm?.Nome || 'Sem administrador',
      Setores: r.Setores.map(s => s.Setor.Nome).join(', ') || 'Sem setores',
      TotalSetores: r.Setores.length,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Erro no GET /rotas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createRota(req, res) {
  try {
    const { nome, idAdm } = req.body;
    if (!nome || !idAdm) {
      return res.status(400).json({ error: 'Nome da rota e administrador são obrigatórios' });
    }

    const rota = await prisma.rota.create({
      data: {
        Nome_Rota: nome,
        Id_Adm: parseInt(idAdm),
      },
      include: {
        Adm: { select: { Nome: true } },
        Setores: { include: { Setor: { select: { Nome: true } } } },
      },
    });

    return res.status(201).json({
      message: 'Rota criada com sucesso',
      rota: {
        id: rota.id,
        Nome: rota.Nome_Rota,
        Administrador: rota.Adm?.Nome || 'Sem administrador',
        Setores: rota.Setores.map(s => s.Setor.Nome).join(', ') || 'Sem setores',
        TotalSetores: rota.Setores.length,
      },
      id: rota.id,
    });
  } catch (error) {
    console.error('Erro ao criar rota:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateRota(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  if (!id || !nome) {
    return res.status(400).json({ error: 'ID e nome da rota são obrigatórios' });
  }

  try {
    const updated = await prisma.rota.update({
      where: { id: parseInt(id) },
      data: { Nome_Rota: nome },
      include: {
        Adm: { select: { Nome: true } },
        Setores: { include: { Setor: { select: { Nome: true } } } },
      },
    });

    return res.status(200).json({
      message: 'Rota atualizada com sucesso',
      rota: {
        id: updated.id,
        Nome: updated.Nome_Rota,
        Administrador: updated.Adm?.Nome || 'Sem administrador',
        Setores: updated.Setores.map(s => s.Setor.Nome).join(', ') || 'Sem setores',
        TotalSetores: updated.Setores.length,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }
    console.error('Erro ao atualizar rota:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteRota(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID da rota é obrigatório' });
  }

  try {
    const vistorias = await prisma.vistoria.count({ where: { Id_Rota: parseInt(id) } });
    if (vistorias > 0) {
      return res.status(409).json({
        error: 'Não é possível excluir esta rota porque existem vistorias vinculadas a ela',
      });
    }

    await prisma.setorRota.deleteMany({ where: { Id_Rota: parseInt(id) } });
    await prisma.rota.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: 'Rota excluída com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }
    console.error('Erro ao excluir rota:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}