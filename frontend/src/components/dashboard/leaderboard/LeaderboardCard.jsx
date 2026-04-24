'use client' // Avisamos que é um Client Component

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LeaderboardFirst from "./LeaderboardFirst";
import LeaderboardSecond from "./LeaderboardSecond";
import LeaderboardThird from "./LeaderboardThird";
import { getRankingDoMes } from '@/lib/controllers/dashboard'; 

const LeaderboardCard = ({ className }) => {
  
  const [ranking, setRanking] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // O useEffect com array vazio [] garante que isso só rode UMA VEZ
  useEffect(() => {
    async function buscarDados() {
      try {
        const dados = await getRankingDoMes();
        setRanking(dados);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  
  if (carregando) {
    return (
      <Card className={cn("w-full h-auto max-w-lg p-10 flex justify-center items-center", className)}>
        <p className="text-gray-500 animate-pulse">Carregando ranking...</p>
      </Card>
    );
  }

  // se nn tiver nota vira 0.0
  const primeiro = ranking[0] || { NomeSetor: 'Aguardando', MediaNota: '0.0' };
  const segundo = ranking[1] || { NomeSetor: 'Aguardando', MediaNota: '0.0' };
  const terceiro = ranking[2] || { NomeSetor: 'Aguardando', MediaNota: '0.0' };

  return (
    <Card className={cn("justify-self-center w-full h-auto max-w-lg pb-6 bg-white ring-0 shadow-md m-5 p-3 pt-10 pb-10", className)}>
      <CardHeader>
        <CardTitle className="text-4xl">Ranking do mês</CardTitle>
        <CardDescription className="text-lg">
          O setor de <span className="font-semibold text-gray-900">{primeiro.NomeSetor}</span> ganhou o troféu de ouro de organização este mês
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <LeaderboardFirst setor={primeiro.NomeSetor} nota={primeiro.MediaNota} />
        <LeaderboardSecond setor={segundo.NomeSetor} nota={segundo.MediaNota} />
        <LeaderboardThird setor={terceiro.NomeSetor} nota={terceiro.MediaNota} />
      </CardContent>
    </Card>
  );
};

export { LeaderboardCard };