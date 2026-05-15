import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getUser, login, logout, loginMobile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Middleware para tratar erros de validação
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validação para login
const loginValidation = [
  body('email').isEmail().trim().normalizeEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 1 }).withMessage('Senha é obrigatória'),
  validationErrorHandler,
];

router.post('/auth', loginValidation, login);
router.post('/logout', logout);
router.post('/login', loginValidation, loginMobile);
router.get('/user', authMiddleware, getUser);

export default router;
