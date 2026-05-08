// src/lib/controllers/dashboard.js
import { apiFetch } from '@/lib/api';

export async function getRankingDoMes() {
  const res = await apiFetch('/api/dashboard/ranking-mes');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar ranking do mês');
  }
  return await res.json();
}

export async function getMediaMensal() {
  const res = await apiFetch('/api/dashboard/media-mensal');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar média mensal');
  }
  return await res.json();
}

export async function getMaiorNotaDia() {
  const res = await apiFetch('/api/dashboard/maior-nota-dia');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar maior nota do dia');
  }
  return await res.json();
}

export async function getGraficoPontuacaoMensal() {
  const res = await apiFetch('/api/dashboard/grafico-pontuacao-mensal');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar dados do gráfico');
  }
  return await res.json();
}

export async function getGraficoSetoresMensal() {
  const res = await apiFetch('/api/dashboard/grafico-setores-mensal');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar dados do gráfico');
  }
  return await res.json();
}   


export async function getDistribuicaoNotasEquipes() {
  const res = await apiFetch('/api/dashboard/distribuicao-notas-equipes');
  if (!res.ok) throw new Error('Erro ao buscar distribuição de notas');
  const json = await res.json();
  return json.dados; 
}

export async function getChecklistsHoje() {
  const res = await apiFetch('/api/dashboard/checklists-hoje');
  if (!res.ok) throw new Error('Erro ao buscar checklists de hoje');
  return await res.json(); 
}