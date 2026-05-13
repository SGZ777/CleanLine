import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';

export async function getFuncionarios(_req, res) {
  try {
    // Busca os três tipos de funcionários ativos
    const adms = await prisma.aDM.findMany({
      where: { status: 'ativo' },
      select: {
        id: true,
        Nome: true,
        Email: true,
        Tel: true,
        status: true,
      },
    });
    const supervisores = await prisma.supervisor.findMany({
      where: { status: 'ativo' },
      select: {
        id: true,
        Nome: true,
        Email: true,
        Tel: true,
        status: true,
      },
    });
    const funcLimpeza = await prisma.func_Limpeza.findMany({
      where: { status: 'ativo' },
      include: { Equipe: { select: { Nome: true } } },
    });

    // Mapeia para o formato esperado pelo front
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
      })),
    ].sort((a, b) => a.Nome.localeCompare(b.Nome));

    return res.status(200).json(funcionarios);
  } catch (error) {
    console.error('Erro no GET /funcionarios:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

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
          data: {
            Nome: nome,
            Email: email,
            Senha: hashedPassword,
            Tel: tel,
          },
        });
        break;

      case 'Supervisor':
        if (!cpf || !estado || !cidade || !bairro || !logradouro || !numero || !cep) {
          return res.status(400).json({ error: 'Dados de endereço incompletos para Supervisor' });
        }
        result = await prisma.supervisor.create({
          data: {
            Nome: nome,
            Email: email,
            Senha: hashedPassword,
            CPF: cpf,
            Tel: tel,
            Estado: estado,
            Cidade: cidade,
            Bairro: bairro,
            Logradouro: logradouro,
            N: parseInt(numero),
            CEP: cep,
          },
        });
        break;

      case 'Funcionário de Limpeza':
        if (!idEquipe) {
          return res.status(400).json({ error: 'ID da equipe é obrigatório para Funcionário de Limpeza' });
        }
        result = await prisma.func_Limpeza.create({
          data: {
            Id_Equipe: parseInt(idEquipe),
            Nome: nome,
            Tel: tel,
            Email: email,
          },
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
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function inativarFuncionario(req, res) {
  const { id } = req.params;
  const { tipo } = req.query;

  if (!id || !tipo) {
    return res.status(400).json({ error: 'ID e tipo são obrigatórios' });
  }

  try {
    let result;
    switch (tipo) {
      case 'ADM':
        result = await prisma.aDM.update({
          where: { id: parseInt(id) },
          data: { status: 'inativo' },
        });
        break;
      case 'Supervisor':
        result = await prisma.supervisor.update({
          where: { id: parseInt(id) },
          data: { status: 'inativo' },
        });
        break;
      case 'Func_Limpeza':
        result = await prisma.func_Limpeza.update({
          where: { id: parseInt(id) },
          data: { status: 'inativo' },
        });
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    return res.status(200).json({ message: 'Funcionário inativado com sucesso' });
  } catch (error) {
    console.error('Erro ao inativar:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateFuncionario(req, res) {
  const { id } = req.params;
  const { tipo, nome, email, tel } = req.body;

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
        updated = await prisma.func_Limpeza.update({
          where: { id: parseInt(id) },
          data: { Nome: nome, Email: email, Tel: tel },
        });
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    // Retorna formato esperado pelo front
    const funcionario = {
      id: updated.id,
      Nome: updated.Nome,
      Cargo: tipo === 'ADM' ? 'Administrador' : tipo === 'Supervisor' ? 'Supervisor' : 'Funcionário de Limpeza',
      Setor: tipo === 'ADM' ? 'Administrativo' : tipo === 'Supervisor' ? 'Operacional' : await getSetorNome(updated.Id_Equipe),
      Email: updated.Email,
      Tel: updated.Tel,
      Tipo: tipo,
      status: updated.status,
    };

    return res.status(200).json({ message: 'Atualizado com sucesso', funcionario });
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Helper para buscar nome da equipe
async function getSetorNome(idEquipe) {
  if (!idEquipe) return 'Sem equipe';
  const equipe = await prisma.equipe_Limpeza.findUnique({ where: { Id: idEquipe }, select: { Nome: true } });
  return equipe?.Nome || 'Sem equipe';
}