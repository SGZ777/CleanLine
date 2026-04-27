import { Router } from 'express';
import {
  createEquipe,
  deleteEquipe,
  getEquipes,
  updateEquipe,
} from '../controllers/equipesController.js';

const router = Router();

router.get('/', getEquipes);
router.post('/', createEquipe);
router.put('/:id', updateEquipe);
router.patch('/:id', deleteEquipe);

export default router;
