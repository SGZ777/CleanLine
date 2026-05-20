import { Router } from 'express';
import {
  getFuncionarios,
  createFuncionario,
  deleteFuncionario,
  updateFuncionario,
} from '../controllers/funcionariosController.js';

const router = Router();

router.get('/', getFuncionarios);
router.post('/', createFuncionario);
router.put('/:id', updateFuncionario);
router.patch('/:id', deleteFuncionario);
router.delete('/:id', deleteFuncionario);

export default router;
