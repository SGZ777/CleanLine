import { Router } from 'express';
import { criarVistoriaMobile } from '../controllers/vistoriaController.js';
import { upload } from '../middlewares/upload.js'; // Garanta que usa memoryStorage()

const router = Router();

// O campo "imagem" aqui deve bater com o nome enviado pelo Retrofit
router.post('/', upload.single('imagem'), criarVistoriaMobile);

export default router;