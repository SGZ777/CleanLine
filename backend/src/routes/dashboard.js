import { Router } from 'express';
import {
  getMediaMensal,
  getMaiorNotaDia,
  getGraficoPontuacaoMensal,
  getRankingDoMes,
  getGraficoSetoresMensal,
  getDistribuicaoNotasEquipes,
  getChecklistsHoje
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/media-mensal', getMediaMensal);
router.get('/maior-nota-dia', getMaiorNotaDia);
router.get('/grafico-pontuacao-mensal', getGraficoPontuacaoMensal);
router.get('/ranking-mes', getRankingDoMes);
router.get('/grafico-setores-mensal', getGraficoSetoresMensal);
router.get('/distribuicao-notas-equipes', getDistribuicaoNotasEquipes);
router.get('/checklists-hoje', getChecklistsHoje);

export default router;
