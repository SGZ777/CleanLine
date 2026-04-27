import prisma from '../../prisma/client.js';

export async function createInspecao(req, res) {
  try {
    const { setor_id, user_id, itens_5s } = req.body;
    if (!setor_id || !user_id || !itens_5s) {
      return res.status(400).json({ error: 'Dados incompletos' });
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
    return res.status(500).json({ error: 'Erro interno do servidor' });
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
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 