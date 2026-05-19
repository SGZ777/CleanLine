import { Router } from 'express';
import { obterPerfilSupervisor } from '../controllers/supervisorController.js';

const router = Router();

// Define a rota GET com o parâmetro dinâmico ":id"
router.get('/:id', obterPerfilSupervisor);

export default router;