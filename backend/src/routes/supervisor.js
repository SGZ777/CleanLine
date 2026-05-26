import { Router } from 'express';
import { obterPerfilSupervisor } from '../controllers/supervisorController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Define a rota GET com o parâmetro dinâmico ":id" protegida por token
router.get('/:id', authMiddleware, obterPerfilSupervisor);

export default router;