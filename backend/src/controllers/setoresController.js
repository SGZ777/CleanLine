import prisma from '../../prisma/client.js';

export async function getSetores(_req, res) {
  try {
    const setores = await prisma.setor.findMany({
      include: {
        Equipe: { select: { Nome: true } },
        Rotas: {
          include: { Rota: { select: { Nome_Rota: true } } },
        },
      },
      orderBy: { Nome: 'asc' },
    });

    const formatted = setores.map(s => ({
      id: s.id,
      Nome: s.Nome,
      TagNfc: s.Id_Nfc,
      Equipe: s.Equipe?.Nome || 'Sem equipe',
      Rotas: s.Rotas.map(r => r.Rota.Nome_Rota).join(', ') || 'Sem rota',
      TotalRotas: s.Rotas.length,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Erro no GET /setores:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createSetor(req, res) {
  try {
    const { nome, tagNfc, idEquipe } = req.body;
    if (!nome || !tagNfc || !idEquipe) {
      return res.status(400).json({ error: 'Nome, tag NFC e equipe são obrigatórios' });
    }

    const setor = await prisma.setor.create({
      data: {
        Nome: nome,
        Id_Nfc: tagNfc,
        Id_Limp: parseInt(idEquipe),
      },
      include: { Equipe: true },
    });

    return res.status(201).json({
      message: 'Setor criado com sucesso',
      setor: {
        id: setor.id,
        Nome: setor.Nome,
        TagNfc: setor.Id_Nfc,
        Equipe: setor.Equipe?.Nome || 'Sem equipe',
        Rotas: '',
        TotalRotas: 0,
      },
      id: setor.id,
    });
  } catch (error) {
    console.error('Erro ao criar setor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateSetor(req, res) {
  const { id } = req.params;
  const { nome, tagNfc } = req.body;
  if (!id || !nome || !tagNfc) {
    return res.status(400).json({ error: 'ID, nome e tag NFC são obrigatórios' });
  }

  try {
    const updated = await prisma.setor.update({
      where: { id: parseInt(id) },
      data: { Nome: nome, Id_Nfc: tagNfc },
      include: { Equipe: true, Rotas: { include: { Rota: true } } },
    });

    const setorFormatado = {
      id: updated.id,
      Nome: updated.Nome,
      TagNfc: updated.Id_Nfc,
      Equipe: updated.Equipe?.Nome || 'Sem equipe',
      Rotas: updated.Rotas.map(r => r.Rota.Nome_Rota).join(', ') || 'Sem rota',
      TotalRotas: updated.Rotas.length,
    };

    return res.status(200).json({ message: 'Setor atualizado com sucesso', setor: setorFormatado });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    console.error('Erro ao atualizar setor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteSetor(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID do setor é obrigatório' });
  }

  try {
    // Verifica dependências
    const vistorias = await prisma.vistoria.count({ where: { Id_Setor: parseInt(id) } });
    const perguntas = await prisma.pergunta.count({ where: { Id_Setor: parseInt(id) } });
    if (vistorias > 0 || perguntas > 0) {
      return res.status(409).json({
        error: 'Não é possível excluir este setor porque existem vistorias ou perguntas vinculadas a ele',
      });
    }

    // Deleta associações e o setor
    await prisma.setorRota.deleteMany({ where: { Id_Setor: parseInt(id) } });
    await prisma.setor.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: 'Setor excluído com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    console.error('Erro ao excluir setor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}