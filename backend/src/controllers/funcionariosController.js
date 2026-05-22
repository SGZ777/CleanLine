import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';

// Helper para buscar nome da equipe (usado no retorno da listagem e atualização)
async function getSetorNome(idEquipe) {
  if (!idEquipe) return 'Sem equipe';
  const equipe = await prisma.equipe_Limpeza.findUnique({
    where: { Id: idEquipe },
    select: { Nome: true },
  });
  return equipe?.Nome || 'Sem equipe';
}

/**
 * GET /api/funcionarios
 * Lista todos os funcionários ativos (ADM, Supervisor, Func_Limpeza)
 * Inclui idEquipe para funcionários de limpeza (usado na edição)
 */
export async function getFuncionarios(_req, res) {
  try {
    const adms = await prisma.aDM.findMany({
      where: { status: 'ativo' },
      select: { id: true, Nome: true, Email: true, Tel: true, status: true },
    });

    const supervisores = await prisma.supervisor.findMany({
      where: { status: 'ativo' },
      select: { id: true, Nome: true, Email: true, Tel: true, status: true },
    });

    const funcLimpeza = await prisma.func_Limpeza.findMany({
      where: { status: 'ativo' },
      include: { Equipe: { select: { Id: true, Nome: true } } },
    });

    const funcionarios = [
      ...adms.map(a => ({
        id: a.id,
        Nome: a.Nome,
        Cargo: 'Administrador',
        Setor: 'Administrativo',
        Email: a.Email,
        Tel: a.Tel,
        Tipo: 'ADM',
        status: a.status,
      })),
      ...supervisores.map(s => ({
        id: s.id,
        Nome: s.Nome,
        Cargo: 'Supervisor',
        Setor: 'Operacional',
        Email: s.Email,
        Tel: s.Tel,
        Tipo: 'Supervisor',
        status: s.status,
      })),
      ...funcLimpeza.map(f => ({
        id: f.id,
        Nome: f.Nome,
        Cargo: 'Funcionário de Limpeza',
        Setor: f.Equipe?.Nome || 'Sem equipe',
        Email: f.Email,
        Tel: f.Tel,
        Tipo: 'Func_Limpeza',
        status: f.status,
        // Novo campo para facilitar edição da equipe no frontend
        idEquipe: f.Id_Equipe,
      })),
    ].sort((a, b) => a.Nome.localeCompare(b.Nome));

    return res.status(200).json(funcionarios);
  } catch (error) {
    console.error('Erro no GET /funcionarios:', error);
    return res.status(500).json({ error: 'Erro ao buscar funcionários.' });
  }
}

/**
 * POST /api/funcionarios
 * Cria um funcionário (ADM, Supervisor ou Func_Limpeza)
 */
export async function createFuncionario(req, res) {
  try {
    const {
      nome, email, senha, tel, cargo,
      cpf, estado, cidade, bairro, logradouro, numero, cep,
      idEquipe,
    } = req.body;

    if (!nome || !email || !senha || !tel || !cargo) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    let result;
    switch (cargo) {
      case 'Administrador':
        result = await prisma.aDM.create({
          data: { Nome: nome, Email: email, Senha: hashedPassword, Tel: tel },
        });
        break;

      case 'Supervisor':
        if (!cpf || !estado || !cidade || !bairro || !logradouro || !numero || !cep) {
          return res.status(400).json({ error: 'Dados de endereço incompletos para Supervisor' });
        }
        result = await prisma.supervisor.create({
          data: {
            Nome: nome, Email: email, Senha: hashedPassword, CPF: cpf, Tel: tel,
            Estado: estado, Cidade: cidade, Bairro: bairro,
            Logradouro: logradouro, N: parseInt(numero), CEP: cep,
          },
        });
        break;

      case 'Funcionário de Limpeza':
        if (!idEquipe) {
          return res.status(400).json({ error: 'ID da equipe é obrigatório para Funcionário de Limpeza' });
        }
        // Validar existência da equipe
        const equipe = await prisma.equipe_Limpeza.findUnique({ where: { Id: parseInt(idEquipe) } });
        if (!equipe) {
          return res.status(404).json({ error: `Equipe com ID ${idEquipe} não encontrada.` });
        }
        result = await prisma.func_Limpeza.create({
          data: { Id_Equipe: parseInt(idEquipe), Nome: nome, Tel: tel, Email: email },
        });
        break;

      default:
        return res.status(400).json({ error: 'Cargo inválido' });
    }

    return res.status(201).json({ message: 'Funcionário criado com sucesso', id: result.id });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'A equipe especificada não existe.' });
    }
    return res.status(500).json({ error: 'Erro ao criar funcionário.' });
  }
}

/**
 * PATCH/DELETE /api/funcionarios/:id?tipo=...
 * Exclui definitivamente um funcionário.
 * PATCH foi mantido por compatibilidade com o frontend atual.
 */
export async function deleteFuncionario(req, res) {
  const { id } = req.params;
  const { tipo } = req.query;
  const funcionarioId = parseInt(id, 10);

  if (!id || !tipo) {
    return res.status(400).json({ error: 'ID e tipo são obrigatórios' });
  }

  if (Number.isNaN(funcionarioId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    switch (tipo) {
      case 'ADM':
        await prisma.$transaction(async (tx) => {
          await tx.rota.updateMany({
            where: { Id_Adm: funcionarioId },
            data: { Id_Adm: null },
          });

          await tx.aDM.delete({
            where: { id: funcionarioId },
          });
        });
        break;
      case 'Supervisor':
        await prisma.$transaction(async (tx) => {
          await tx.vistoria.updateMany({
            where: { Id_Super: funcionarioId },
            data: { Id_Super: null },
          });

          await tx.supervisor.delete({
            where: { id: funcionarioId },
          });
        });
        break;
      case 'Func_Limpeza':
        await prisma.func_Limpeza.delete({
          where: { id: funcionarioId },
        });
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }
    return res.status(200).json({ message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Funcionário com ID ${id} não encontrado.` });
    }
    console.error('Erro ao excluir funcionário:', error);
    return res.status(500).json({ error: 'Erro ao excluir funcionário.' });
  }
}

/**
 * PUT /api/funcionarios/:id
 * Atualiza dados básicos do funcionário (nome, email, tel) e, no caso de Func_Limpeza, a equipe (idEquipe)
 */
export async function updateFuncionario(req, res) {
  const { id } = req.params;
  const { tipo, nome, email, tel, idEquipe } = req.body;

  if (!id || !tipo) {
    return res.status(400).json({ error: 'ID e tipo são obrigatórios' });
  }

  try {
    let updated;
    switch (tipo) {
      case 'ADM':
        updated = await prisma.aDM.update({
          where: { id: parseInt(id) },
          data: { Nome: nome, Email: email, Tel: tel },
        });
        break;
      case 'Supervisor':
        updated = await prisma.supervisor.update({
          where: { id: parseInt(id) },
          data: { Nome: nome, Email: email, Tel: tel },
        });
        break;
      case 'Func_Limpeza':
        // Construir objeto de atualização dinâmico
        const data = { Nome: nome, Email: email, Tel: tel };
        if (idEquipe !== undefined && idEquipe !== null && idEquipe !== '') {
          // Validar se a equipe existe
          const equipeExists = await prisma.equipe_Limpeza.findUnique({ where: { Id: parseInt(idEquipe) } });
          if (!equipeExists) {
            return res.status(404).json({ error: `Equipe com ID ${idEquipe} não encontrada.` });
          }
          data.Id_Equipe = parseInt(idEquipe);
        }
        updated = await prisma.func_Limpeza.update({
          where: { id: parseInt(id) },
          data,
        });
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    // Monta o objeto de resposta no formato esperado pelo front
    const funcionario = {
      id: updated.id,
      Nome: updated.Nome,
      Cargo:
        tipo === 'ADM'
          ? 'Administrador'
          : tipo === 'Supervisor'
          ? 'Supervisor'
          : 'Funcionário de Limpeza',
      Setor:
        tipo === 'ADM'
          ? 'Administrativo'
          : tipo === 'Supervisor'
          ? 'Operacional'
          : await getSetorNome(updated.Id_Equipe),
      Email: updated.Email,
      Tel: updated.Tel,
      Tipo: tipo,
      status: updated.status,
      // Incluir idEquipe novamente para que o front receba o valor atualizado
      idEquipe: tipo === 'Funcionário Limpeza' ? updated.Id_Equipe : undefined,
    };

    return res.status(200).json({ message: 'Atualizado com sucesso', funcionario });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Funcionário com ID ${id} não encontrado.` });
    }
    console.error('Erro ao atualizar:', error);
    return res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
  }
}
