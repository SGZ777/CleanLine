import { Router } from 'express';
import {
  getMediaMensal,
  getMaiorNotaDia,
  getGraficoPontuacaoMensal,
  getRankingDoMes,
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/media-mensal', getMediaMensal);
router.get('/maior-nota-dia', getMaiorNotaDia);
router.get('/grafico-pontuacao-mensal', getGraficoPontuacaoMensal);
router.get('/ranking-mes', getRankingDoMes);

export default router;
