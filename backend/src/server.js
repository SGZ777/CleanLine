import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http'; // 🔥 ADICIONADO: Necessário para WebSockets estáveis

import { adminMiddleware, authMiddleware } from './middlewares/auth.js';
import { createRateLimiter } from './middlewares/rateLimit.js';
import authRoutes from './routes/auth.js';
import equipesRoutes from './routes/equipes.js';
import funcionariosRoutes from './routes/funcionarios.js';
import setoresRoutes from './routes/setores.js';
import rotasRoutes from './routes/rotas.js';
import dashboardRoutes from './routes/dashboard.js';
import inspecoesRoutes from './routes/inspecoes.js';
import vistoriasRoutes from './routes/vistorias.js';
import supervisorRoutes from './routes/supervisor.js';

// 🔥 ADICIONADO: Importa a função que configuramos antes
// (Ajuste o caminho './socket.js' se o arquivo estiver em outra pasta)
import { initSocket } from './socket.js'; 

dotenv.config();

const app = express();
const server = createServer(app); // 🔥 ADICIONADO: Cria o servidor HTTP acoplado ao Express

app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
const apiRateLimiter = createRateLimiter({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
});
const authRateLimiter = createRateLimiter({
  windowMs: process.env.AUTH_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000,
  maxRequests: process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 10,
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
});
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://clean-line.vercel.app',
  'http://localhost:3000',
].filter(Boolean);

// Middlewares globais
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use('/api/auth', authRateLimiter);
app.use('/api/login', authRateLimiter);
app.use('/api', apiRateLimiter);

app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/api', authRoutes);
app.use('/api/equipes', authMiddleware, adminMiddleware, equipesRoutes);
app.use('/api/funcionarios', authMiddleware, adminMiddleware, funcionariosRoutes);
app.use('/api/setores', authMiddleware, adminMiddleware, setoresRoutes);
app.use('/api/rotas', authMiddleware, adminMiddleware, rotasRoutes);
app.use('/api/dashboard', authMiddleware, adminMiddleware, dashboardRoutes);
app.use('/api/inspecoes', authMiddleware, adminMiddleware, inspecoesRoutes);
app.use('/api/vistoria', vistoriasRoutes);
app.use('/api/supervisor', supervisorRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🔥 ADICIONADO: Inicializa o Socket.IO passando o servidor HTTP estruturado
initSocket(server);

// 🔥 MODIFICADO: Agora escutamos o 'server', não mais o 'app'
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} com suporte a WebSockets!`);
});

export default app;
