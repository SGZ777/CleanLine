import { Router } from 'express';
import { createInspecao, getInspecoes } from '../controllers/inspecoesController.js';

const router = Router();

router.get('/', getInspecoes);
router.post('/', createInspecao);

export default router;
