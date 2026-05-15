import { Router } from 'express';
import {
  getFuncionarios,
  createFuncionario,
  inativarFuncionario,
  updateFuncionario,
} from '../controllers/funcionariosController.js';

const router = Router();

router.get('/', getFuncionarios);
router.post('/', createFuncionario);
router.patch('/:id', inativarFuncionario);
router.put('/:id', updateFuncionario);
router.delete('/:id', inativarFuncionario);

export default router;
