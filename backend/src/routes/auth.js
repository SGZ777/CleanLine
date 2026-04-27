import { Router } from 'express';
import { getUser, login, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/auth', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);

export default router;
