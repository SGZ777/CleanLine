import { Router } from 'express';
import { createInspecao, getInspecoes } from '../controllers/inspecoesController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getInspecoes);
router.post('/', createInspecao);

export default router;
