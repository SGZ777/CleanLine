import { Router } from 'express';
import {
  getRotas,
  createRota,
  updateRota,
  deleteRota,
} from '../controllers/rotasController.js';

const router = Router();

router.get('/', getRotas);
router.post('/', createRota);
router.put('/:id', updateRota);
router.patch('/:id', deleteRota);

export default router;
