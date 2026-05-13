import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { sanitizeEmail } from '../utils/sanitizers.js';
import { AppError } from '../middlewares/errorHandler.js';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '8h';
const SALT_ROUNDS = 10;

// Validação da chave secreta
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não configurada');
}

/**
 * Login - Autentica usuário e retorna JWT token
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    // Validação de entrada
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        error: emailValidation.error,
        timestamp: new Date().toISOString(),
      });
    }

    const senhaValidation = validatePassword(senha);
    if (!senhaValidation.valid) {
      return res.status(400).json({
        error: senhaValidation.error,
        timestamp: new Date().toISOString(),
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Busca usuário no banco
    const user = await prisma.aDM.findFirst({
      where: {
        Email: sanitizedEmail,
        status: 'ativo', // Garante que usuário está ativo
      },
    });

    if (!user) {
      // Retorna erro genérico para não expor se email existe
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        timestamp: new Date().toISOString(),
      });
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, user.Senha);
    if (!senhaValida) {
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        timestamp: new Date().toISOString(),
      });
    }

    // Gera token JWT com dados mínimos
    const token = jwt.sign(
      {
        id: user.id,
        email: user.Email,
        role: 'admin',
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRY,
        algorithm: 'HS256',
      }
    );

    // Retorna resposta segura (sem dados sensíveis)
    return res.status(200).json({
      success: true,
      mensagem: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.Nome,
        email: user.Email,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro no login:', error.message);

    // Não exponha detalhes de erro
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Usuário já existe',
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
 * Obter dados do usuário autenticado
 * GET /api/auth/me
 * Requer autenticação
 */
export async function getUser(req, res, next) {
  try {
    // req.user vem do middleware de autenticação
    if (!req.user?.id) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const adm = await prisma.aDM.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        Nome: true,
        Email: true,
        status: true,
      },
    });

    if (!adm) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.status(200).json({
      user: {
        id: adm.id,
        name: adm.Nome,
        email: adm.Email,
        status: adm.status,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    console.error('Erro ao buscar usuário:', error.message);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Logout - Invalida sessão do lado do cliente
 * POST /api/auth/logout
 */
export function logout(req, res) {
  // JWT é stateless, logout é apenas remoção do token no frontend
  return res.status(200).json({
    success: true,
    mensagem: 'Logout realizado com sucesso',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Verificar se token é válido
 * GET /api/auth/validate
 */
export function validateToken(req, res) {
  // Se chegou aqui, foi validado pelo middleware
  return res.status(200).json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
    timestamp: new Date().toISOString(),
  });
}