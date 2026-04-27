import { Router } from 'express';
import {
  getMediaMensal,
  getMaiorNotaDia,
  getGraficoPontuacaoMensal,
  getRankingDoMes,
  getGraficoSetoresMensal
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/media-mensal', getMediaMensal);
router.get('/maior-nota-dia', getMaiorNotaDia);
router.get('/grafico-pontuacao-mensal', getGraficoPontuacaoMensal);
router.get('/ranking-mes', getRankingDoMes);
router.get('/grafico-setores-mensal', getGraficoSetoresMensal);

export default router;
