import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function obterPerfilSupervisor(req, res) {
  try {
    // 1. Pega o ID que vem na URL (ex: /api/supervisor/3 -> pega o "3")
    const { id } = req.params;
    const supervisorId = parseInt(id, 10);

    // Validação de segurança (Prevenção de IDOR/BOLA):
    // Apenas Administradores ou o próprio Supervisor dono do perfil podem acessar esta rota.
    if (!req.user || (req.user.role !== 'admin' && req.user.id !== supervisorId)) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para visualizar este perfil.' });
    }

    // 2. Busca o supervisor no banco de dados
    const supervisor = await prisma.supervisor.findUnique({
      where: {
        id: supervisorId,
      },
      // Usamos o 'select' para trazer todos os dados, EXCETO a senha por segurança
      select: {
        id: true,
        Nome: true,
        Email: true,
        CPF: true,
        Tel: true,
        Estado: true,
        Cidade: true,
        Bairro: true,
        Logradouro: true,
        N: true,
        CEP: true,
        status: true
      }
    });

    // 3. Verifica se encontrou alguém
    if (!supervisor) {
      return res.status(404).json({ error: 'Supervisor não encontrado' });
    }

    // 4. Devolve os dados com sucesso (Status 200)
    return res.status(200).json(supervisor);

  } catch (error) {
    console.error('====== ERRO AO BUSCAR SUPERVISOR ======', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}