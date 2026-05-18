import { Router } from 'express';
import { criarVistoriaMobile } from '../controllers/vistoriaController.js';
import { upload } from '../middlewares/upload.js'; // multer memoryStorage

const router = Router();

router.post('/', upload.single('imagem'), criarVistoriaMobile);

export default router;