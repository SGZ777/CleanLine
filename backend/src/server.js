import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import equipesRoutes from './routes/equipes.js';
import funcionariosRoutes from './routes/funcionarios.js';
import setoresRoutes from './routes/setores.js';
import rotasRoutes from './routes/rotas.js';
import dashboardRoutes from './routes/dashboard.js';
import inspecoesRoutes from './routes/inspecoes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

// Validação de variáveis de ambiente obrigatórias
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Erro: Variável de ambiente ${envVar} não está definida`);
    process.exit(1);
  }
}

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS - apenas origens autorizadas
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://clean-line.vercel.app',
  'http://localhost:3000',
].filter(Boolean);

// Middlewares de segurança
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600, // 10 minutos
}));

// Limita tamanho de requisições
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Header de segurança - não exponha versão Express
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rotas
app.use('/api', authRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/setores', setoresRoutes);
app.use('/api/rotas', rotasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inspecoes', inspecoesRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
  });
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Middleware centralizado de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} [${NODE_ENV}]`);
  console.log(`CORS habilitado para: ${allowedOrigins.join(', ')}`);
});

export default app;
