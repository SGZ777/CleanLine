/**
 * Middleware centralizado de tratamento de erros
 * Padroniza respostas de erro e não expõe informações sensíveis
 */

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

// Middleware de tratamento de erros
export function errorHandler(err, req, res, next) {
  console.error(`[${err.timestamp || new Date().toISOString()}] Erro:`, err.message);

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo';
    return res.status(409).json({
      error: `${field} já está em uso`,
      timestamp: new Date().toISOString(),
    });
  }

  // Erro de validação única (Prisma)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
      timestamp: new Date().toISOString(),
    });
  }

  // Erro de tipo de dados (Prisma)
  if (err.code === 'P2023') {
    return res.status(400).json({
      error: 'Valor inválido para o campo',
      timestamp: new Date().toISOString(),
    });
  }

  // Erros de aplicação customizados
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      timestamp: err.timestamp,
    });
  }

  // Erro genérico - não exponha detalhes
  res.status(500).json({
    error: 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { debug: err.message })
  });
}

// Wrapper para funções assíncronas (evita try-catch repetido)
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
