import { Router } from 'express';
import {
  createEquipe,
  deleteEquipe,
  getEquipes,
  updateEquipe,
} from '../controllers/equipesController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getEquipes);
router.post('/', createEquipe);
router.put('/:id', updateEquipe);
router.patch('/:id', deleteEquipe);
router.delete('/:id', deleteEquipe);

export default router;
