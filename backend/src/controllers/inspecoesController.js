import prisma from '../../prisma/client.js';

export async function createInspecao(req, res) {
  try {
    const { setor_id, user_id, itens_5s } = req.body;
    if (!setor_id || !user_id || !itens_5s) {
      return res.status(400).json({ error: 'Dados incompletos. Setor, usuário e itens 5S são obrigatórios.' });
    }

    // Valida se o setor existe
    const setorExists = await prisma.setor.findUnique({
      where: { id: parseInt(setor_id) },
    });

    if (!setorExists) {
      return res.status(404).json({ 
        error: `O setor com ID ${setor_id} não existe. Por favor, verifique o ID e tente novamente.` 
      });
    }

    // Valida se o supervisor existe
    const supervisorExists = await prisma.supervisor.findUnique({
      where: { id: parseInt(user_id) },
    });

    if (!supervisorExists) {
      return res.status(404).json({ 
        error: `O supervisor com ID ${user_id} não existe. Por favor, verifique o ID e tente novamente.` 
      });
    }

    // Cria a vistoria com itens 5S como JSON (ajuste conforme necessidade)
    const vistoria = await prisma.vistoria.create({
      data: {
        Id_Setor: parseInt(setor_id),
        Id_Super: parseInt(user_id),
        Id_Rota: 1, // TODO: definir rota adequada
        Image: '', // definir depois
        Pontuacao: calcularPontuacao(itens_5s),
        Data_e_Hora: new Date(),
      },
    });

    return res.status(201).json({ message: 'Inspeção criada com sucesso', id: vistoria.Id });
  } catch (error) {
    console.error('Erro ao criar inspeção:', error);
    
    // Trata erro de chave estrangeira
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: 'Setor ou supervisor especificado não existe. Por favor, verifique os IDs.' 
      });
    }
    
    return res.status(500).json({ error: 'Erro ao criar inspeção. Por favor, tente novamente mais tarde.' });
  }
}

function calcularPontuacao(itens) {
  // Lógica fictícia: soma das notas
  return Object.values(itens).reduce((acc, val) => acc + Number(val), 0);
}

export async function getInspecoes(req, res) {
  try {
    const { setor_id } = req.query;
    const where = setor_id ? { Id_Setor: parseInt(setor_id) } : {};
    const inspecoes = await prisma.vistoria.findMany({
      where,
      orderBy: { Data_e_Hora: 'desc' },
      include: {
        Setor: { select: { Nome: true } },
        Supervisor: { select: { Nome: true } },
        Rota: { select: { Nome_Rota: true } },
      },
    });

    return res.status(200).json({ inspecoes });
  } catch (error) {
    console.error('Erro ao buscar inspeções:', error);
    return res.status(500).json({ error: 'Erro ao buscar inspeções. Por favor, tente novamente mais tarde.' });
  }
}
