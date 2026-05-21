import { Router } from 'express';
import {
  getRotas,
  createRota,
  updateRota,
  deleteRota,
} from '../controllers/rotasController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getRotas);
router.post('/', createRota);
router.put('/:id', updateRota);
router.patch('/:id', deleteRota);
router.delete('/:id', deleteRota);

export default router;
