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

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
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

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
