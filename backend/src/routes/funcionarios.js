import { Router } from 'express';
import {
  getFuncionarios,
  createFuncionario,
  deleteFuncionario,
  updateFuncionario,
} from '../controllers/funcionariosController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getFuncionarios);
router.post('/', createFuncionario);
router.put('/:id', updateFuncionario);
router.patch('/:id', deleteFuncionario);
router.delete('/:id', deleteFuncionario);

export default router;
