import express from 'express';
import cors from 'cors';
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
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

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
  console.log(` Backend CleanLine rodando em http://localhost:${PORT}`);
});

export default app;
