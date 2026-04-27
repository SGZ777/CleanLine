import { Router } from 'express';
import {
  getSetores,
  createSetor,
  updateSetor,
  deleteSetor,
} from '../controllers/setoresController.js';

const router = Router();

router.get('/', getSetores);
router.post('/', createSetor);
router.put('/:id', updateSetor);
router.patch('/:id', deleteSetor);

export default router;
