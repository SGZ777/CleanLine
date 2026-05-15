import prisma from '../../prisma/client.js';

export async function getSetores(_req, res) {
  try {
    const setores = await prisma.setor.findMany({
      include: {
        Equipe: { select: { Id: true, Nome: true } },
        Rotas: {
          select: { Id_Rota: true },
        },
      },
      orderBy: { Nome: 'asc' },
    });

    const formatted = setores.map(s => ({
      id: s.id,
      Nome: s.Nome,
      TagNfc: s.Id_Nfc,
      idEquipe: s.Id_Limp ?? "",
      Equipe: s.Equipe?.Nome || 'Sem equipe',
      idRotas: s.Rotas.map(r => r.Id_Rota),   // array de IDs
      Rotas: s.Rotas.map(r => r.Rota?.Nome_Rota).join(', ') || 'Sem rota',
      TotalRotas: s.Rotas.length,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Erro no GET /setores:', error);
    return res.status(500).json({ error: 'Erro ao buscar setores. Por favor, tente novamente mais tarde.' });
  }
}

export async function createSetor(req, res) {
  try {
    const { nome, tagNfc, idEquipe, rotas } = req.body;

    if (!nome || !tagNfc || !idEquipe) {
      return res.status(400).json({ error: 'Nome, tag NFC e equipe são obrigatórios' });
    }

    const setor = await prisma.setor.create({
      data: {
        Nome: nome,
        Id_Nfc: tagNfc,
        Id_Limp: Number(idEquipe),
      },
    });

    // Se rotas foram enviadas, associa ao setor
    if (rotas && Array.isArray(rotas) && rotas.length > 0) {
      await prisma.setorRota.createMany({
        data: rotas.map(idRota => ({
          Id_Rota: Number(idRota),
          Id_Setor: setor.id,
        })),
      });
    }

    const setorCompleto = await prisma.setor.findUnique({
      where: { id: setor.id },
      include: { Equipe: true, Rotas: { include: { Rota: true } } },
    });

    return res.status(201).json({
      message: 'Setor criado com sucesso',
      setor: {
        id: setorCompleto.id,
        Nome: setorCompleto.Nome,
        TagNfc: setorCompleto.Id_Nfc,
        Equipe: setorCompleto.Equipe?.Nome || 'Sem equipe',
        Rotas: setorCompleto.Rotas.map(r => r.Rota.Nome_Rota).join(', ') || 'Sem rota',
        TotalRotas: setorCompleto.Rotas.length,
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
  const { nome, tagNfc, idEquipe, rotas } = req.body;
  
  if (!id || !nome || !tagNfc || !idEquipe) {
    return res.status(400).json({ error: 'ID, nome, tag NFC e equipe são obrigatórios' });
  }

  try {
    console.log('Atualizando setor', id);
    
    // 1. Atualizar dados básicos do setor
    const updated = await prisma.setor.update({
      where: { id: parseInt(id) },
      data: {
        Nome: nome,
        Id_Nfc: tagNfc,
        Id_Limp: Number(idEquipe),
      },
    });
    console.log('Setor atualizado, atualizando rotas...');

    // 2. Atualizar associações de rotas (se enviadas)
    if (rotas && Array.isArray(rotas)) {
      // Remover todas as associações atuais
      await prisma.setorRota.deleteMany({ where: { Id_Setor: updated.id } });
      
      // Criar novas associações
      if (rotas.length > 0) {
        await prisma.setorRota.createMany({
          data: rotas.map(idRota => ({
            Id_Rota: Number(idRota),
            Id_Setor: updated.id,
          })),
        });
      }
    }

    // 3. Buscar o setor completo com relacionamentos
    const setorCompleto = await prisma.setor.findUnique({
      where: { id: updated.id },
      include: {
        Equipe: { select: { Id: true, Nome: true } },
        Rotas: { include: { Rota: true } },
      },
    });

    // 4. Formatar e retornar resposta
    const setorFormatado = {
      id: setorCompleto.id,
      Nome: setorCompleto.Nome,
      TagNfc: setorCompleto.Id_Nfc,
      idEquipe: setorCompleto.Id_Limp,
      Equipe: setorCompleto.Equipe?.Nome || 'Sem equipe',
      idRotas: setorCompleto.Rotas.map(r => r.Id_Rota),
      Rotas: setorCompleto.Rotas.map(r => r.Rota.Nome_Rota).join(', ') || 'Sem rota',
      TotalRotas: setorCompleto.Rotas.length,
    };
    
    console.log('Enviando resposta');
    return res.status(200).json({
      message: 'Setor atualizado com sucesso',
      setor: setorFormatado,
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Setor com ID ${id} não encontrado.` });
    }
    console.error('Erro ao atualizar setor:', error);
    return res.status(500).json({ error: 'Erro ao atualizar setor. Por favor, tente novamente mais tarde.' });
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
        error: 'Não é possível excluir este setor porque existem vistorias ou perguntas vinculadas a ele. Remova essas dependências primeiro.',
      });
    }

    // Deleta associações e o setor
    await prisma.setorRota.deleteMany({ where: { Id_Setor: parseInt(id) } });
    await prisma.setor.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: 'Setor excluído com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Setor com ID ${id} não encontrado.` });
    }
    console.error('Erro ao excluir setor:', error);
    return res.status(500).json({ error: 'Erro ao excluir setor. Por favor, tente novamente mais tarde.' });
  }
}
