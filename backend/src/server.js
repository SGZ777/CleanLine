import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Rotas
import authRoutes from './routes/auth.js';
import equipesRoutes from './routes/equipes.js';
import funcionariosRoutes from './routes/funcionarios.js';
import setoresRoutes from './routes/setores.js';
import rotasRoutes from './routes/rotas.js';
import dashboardRoutes from './routes/dashboard.js';
import inspecoesRoutes from './routes/inspecoes.js';
import vistoriasRoutes from './routes/vistorias.js';
import supervisorRoutes from './routes/supervisor.js';

// Socket
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://clean-line.vercel.app',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/api', authRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/setores', setoresRoutes);
app.use('/api/rotas', rotasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inspecoes', inspecoesRoutes);
app.use('/api/vistoria', vistoriasRoutes);
app.use('/api/supervisor', supervisorRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Criar servidor HTTP e inicializar Socket.IO
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});

export default app;