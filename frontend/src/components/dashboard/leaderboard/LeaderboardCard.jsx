'use client'

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
import { getRankingDoMes } from "@/lib/controllers/dashboard";

const LeaderboardCard = ({ className }) => {
  const [ranking, setRanking] = useState([]);
  const [carregando, setCarregando] = useState(true);

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
      <Card className={cn("flex h-auto w-full max-w-lg items-center justify-center p-10", className)}>
        <p className="animate-pulse text-muted-foreground">Carregando ranking...</p>
      </Card>
    );
  }

  const primeiro = ranking[0] || { NomeSetor: "Aguardando", MediaNota: "0.0" };
  const segundo = ranking[1] || { NomeSetor: "Aguardando", MediaNota: "0.0" };
  const terceiro = ranking[2] || { NomeSetor: "Aguardando", MediaNota: "0.0" };

  return (
    <Card
      className={cn(
        "justify-self-center m-3 sm:m-5 h-auto w-full max-w-full sm:max-w-lg border border-border bg-card p-2 sm:p-3 pt-6 sm:pt-10 pb-6 sm:pb-10 shadow-md",
        className
      )}
    >
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl">Ranking do mes</CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-lg mt-2">
          O setor de{" "}
          <span className="font-semibold text-foreground">
            {primeiro.NomeSetor}
          </span>{" "}
          ganhou o trofeu de ouro de organizacao este mes
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
