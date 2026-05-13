import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';
import {
  validateEmail,
  validatePassword,
  validateNome,
  validateTelefone,
  validateCargo,
  validateId,
} from '../utils/validators.js';
import {
  sanitizeEmail,
  sanitizeName,
  sanitizeNumber,
  sanitizeString,
} from '../utils/sanitizers.js';

const SALT_ROUNDS = 10;

/**
 * Obter todos os funcionários ativos
 * GET /api/funcionarios
 */
export async function getFuncionarios(_req, res) {
  try {
    // Busca os três tipos de funcionários ativos
    const [adms, supervisores, funcLimpeza] = await Promise.all([
      prisma.aDM.findMany({
        where: { status: 'ativo' },
        select: {
          id: true,
          Nome: true,
          Email: true,
          Tel: true,
          status: true,
        },
      }),
      prisma.supervisor.findMany({
        where: { status: 'ativo' },
        select: {
          id: true,
          Nome: true,
          Email: true,
          Tel: true,
          status: true,
        },
      }),
      prisma.func_Limpeza.findMany({
        where: { status: 'ativo' },
        include: { Equipe: { select: { Nome: true } } },
      }),
    ]);

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

    return res.status(200).json({
      success: true,
      data: funcionarios,
      total: funcionarios.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro no GET /funcionarios:', error.message);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function createFuncionario(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      tel,
      cargo,
      cpf,
      estado,
      cidade,
      bairro,
      logradouro,
      numero,
      cep,
      idEquipe,
    } = req.body;

    // Validação de campos obrigatórios
    const errors = [];

    const nomeVal = validateNome(nome);
    if (!nomeVal.valid) errors.push(nomeVal.error);

    const emailVal = validateEmail(email);
    if (!emailVal.valid) errors.push(emailVal.error);

    const senhaVal = validatePassword(senha);
    if (!senhaVal.valid) errors.push(senhaVal.error);

    const telVal = validateTelefone(tel);
    if (!telVal.valid) errors.push(telVal.error);

    const cargoVal = validateCargo(cargo);
    if (!cargoVal.valid) errors.push(cargoVal.error);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Sanitiza inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedNome = sanitizeName(nome);
    const sanitizedTel = sanitizeNumber(tel);

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    let result;

    switch (cargo) {
      case 'Administrador':
        result = await prisma.aDM.create({
          data: {
            Nome: sanitizedNome,
            Email: sanitizedEmail,
            Senha: hashedPassword,
            Tel: sanitizedTel,
            status: 'ativo',
          },
        });
        break;

      case 'Supervisor': {
        // Validação de campos de endereço para Supervisor
        const addressErrors = [];

        if (!cpf) addressErrors.push('CPF é obrigatório');
        if (!estado) addressErrors.push('Estado é obrigatório');
        if (!cidade) addressErrors.push('Cidade é obrigatória');
        if (!bairro) addressErrors.push('Bairro é obrigatório');
        if (!logradouro) addressErrors.push('Logradouro é obrigatório');
        if (!numero) addressErrors.push('Número é obrigatório');
        if (!cep) addressErrors.push('CEP é obrigatório');

        if (addressErrors.length > 0) {
          return res.status(400).json({
            error: 'Dados de endereço incompletos para Supervisor',
            details: addressErrors,
            timestamp: new Date().toISOString(),
          });
        }

        result = await prisma.supervisor.create({
          data: {
            Nome: sanitizedNome,
            Email: sanitizedEmail,
            Senha: hashedPassword,
            CPF: sanitizeNumber(cpf),
            Tel: sanitizedTel,
            Estado: estado.toUpperCase(),
            Cidade: sanitizeString(cidade),
            Bairro: sanitizeString(bairro),
            Logradouro: sanitizeString(logradouro),
            N: parseInt(numero, 10),
            CEP: sanitizeNumber(cep),
            status: 'ativo',
          },
        });
        break;
      }

      case 'Funcionário de Limpeza': {
        if (!idEquipe) {
          return res.status(400).json({
            error: 'ID da equipe é obrigatório',
            timestamp: new Date().toISOString(),
          });
        }

        const idVal = validateId(idEquipe);
        if (!idVal.valid) {
          return res.status(400).json({
            error: idVal.error,
            timestamp: new Date().toISOString(),
          });
        }

        result = await prisma.func_Limpeza.create({
          data: {
            Id_Equipe: idVal.value,
            Nome: sanitizedNome,
            Tel: sanitizedTel,
            Email: sanitizedEmail,
            status: 'ativo',
          },
        });
        break;
      }

      default:
        return res.status(400).json({
          error: 'Cargo inválido',
          timestamp: new Date().toISOString(),
        });
    }

    return res.status(201).json({
      success: true,
      message: 'Funcionário criado com sucesso',
      id: result.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error.message);

    // Erro de email duplicado
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email já cadastrado',
        timestamp: new Date().toISOString(),
      });
    }

    // Erro de chave estrangeira (equipe não existe)
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Equipe especificada não existe',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Inativar funcionário (soft delete)
 * PATCH /api/funcionarios/:id
 */
export async function inativarFuncionario(req, res) {
  try {
    const { id } = req.params;
    const { tipo } = req.query;

    // Validação de entrada
    const idVal = validateId(id);
    if (!idVal.valid) {
      return res.status(400).json({
        error: 'ID inválido',
        timestamp: new Date().toISOString(),
      });
    }

    if (!tipo) {
      return res.status(400).json({
        error: 'Tipo de funcionário é obrigatório',
        timestamp: new Date().toISOString(),
      });
    }

    const tiposValidos = ['ADM', 'Supervisor', 'Func_Limpeza'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        error: `Tipo inválido. Aceitos: ${tiposValidos.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
    }

    let result;

    switch (tipo) {
      case 'ADM':
        result = await prisma.aDM.update({
          where: { id: idVal.value },
          data: { status: 'inativo' },
          select: { id: true, Nome: true },
        });
        break;

      case 'Supervisor':
        result = await prisma.supervisor.update({
          where: { id: idVal.value },
          data: { status: 'inativo' },
          select: { id: true, Nome: true },
        });
        break;

      case 'Func_Limpeza':
        result = await prisma.func_Limpeza.update({
          where: { id: idVal.value },
          data: { status: 'inativo' },
          select: { id: true, Nome: true },
        });
        break;
    }

    if (!result) {
      return res.status(404).json({
        error: 'Funcionário não encontrado',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Funcionário inativado com sucesso',
      funcionario: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao inativar funcionário:', error.message);

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Funcionário não encontrado',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Atualizar dados do funcionário
 * PUT /api/funcionarios/:id
 */
export async function updateFuncionario(req, res) {
  try {
    const { id } = req.params;
    const { tipo, nome, email, tel } = req.body;

    // Validação de entrada
    const idVal = validateId(id);
    if (!idVal.valid) {
      return res.status(400).json({
        error: 'ID inválido',
        timestamp: new Date().toISOString(),
      });
    }

    if (!tipo) {
      return res.status(400).json({
        error: 'Tipo de funcionário é obrigatório',
        timestamp: new Date().toISOString(),
      });
    }

    const tiposValidos = ['ADM', 'Supervisor', 'Func_Limpeza'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        error: `Tipo inválido. Aceitos: ${tiposValidos.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Validação dos campos opcionais (se fornecidos)
    const errors = [];

    if (nome) {
      const nomeVal = validateNome(nome);
      if (!nomeVal.valid) errors.push(nomeVal.error);
    }

    if (email) {
      const emailVal = validateEmail(email);
      if (!emailVal.valid) errors.push(emailVal.error);
    }

    if (tel) {
      const telVal = validateTelefone(tel);
      if (!telVal.valid) errors.push(telVal.error);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Sanitiza dados
    const updateData = {};
    if (nome) updateData.Nome = sanitizeName(nome);
    if (email) updateData.Email = sanitizeEmail(email);
    if (tel) updateData.Tel = sanitizeNumber(tel);

    let updated;

    switch (tipo) {
      case 'ADM':
        updated = await prisma.aDM.update({
          where: { id: idVal.value },
          data: updateData,
          select: { id: true, Nome: true, Email: true, Tel: true, status: true },
        });
        break;

      case 'Supervisor':
        updated = await prisma.supervisor.update({
          where: { id: idVal.value },
          data: updateData,
          select: { id: true, Nome: true, Email: true, Tel: true, status: true },
        });
        break;

      case 'Func_Limpeza':
        updated = await prisma.func_Limpeza.update({
          where: { id: idVal.value },
          data: updateData,
          select: { id: true, Nome: true, Email: true, Tel: true, status: true },
        });
        break;
    }

    const funcionario = {
      ...updated,
      Cargo:
        tipo === 'ADM'
          ? 'Administrador'
          : tipo === 'Supervisor'
            ? 'Supervisor'
            : 'Funcionário de Limpeza',
      Tipo: tipo,
    };

    return res.status(200).json({
      success: true,
      message: 'Funcionário atualizado com sucesso',
      funcionario,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error.message);

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Funcionário não encontrado',
        timestamp: new Date().toISOString(),
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email já está em uso',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }
}