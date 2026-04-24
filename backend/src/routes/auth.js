import { Router } from 'express';
import { login, getUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/auth', login);
router.get('/user', authMiddleware, getUser);

export default router;
