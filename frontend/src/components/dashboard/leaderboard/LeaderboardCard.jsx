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
import { Spinner } from "@/components/ui/spinner";

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
      <Card className={cn("flex h-auto w-full max-w-lg items-center justify-center gap-2 p-10 text-muted-foreground", className)}>
        <Spinner />
        Carregando ranking...
      </Card>
    );
  }

  const primeiro = ranking[0] || { NomeSetor: "Aguardando", MediaNota: "0.0" };
  const segundo = ranking[1] || { NomeSetor: "Aguardando", MediaNota: "0.0" };
  const terceiro = ranking[2] || { NomeSetor: "Aguardando", MediaNota: "0.0" };

  return (
    <Card
      className={cn(
        "justify-self-center transition-all hover:scale-105 m-5 h-auto w-full max-w-lg bg-card p-2 pt-10 pb-10 shadow-md dark:border",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-4xl">Ranking do mês</CardTitle>
        <CardDescription className="text-lg">
          O setor de{" "}
          <span className="font-semibold text-foreground">
            {primeiro.NomeSetor}
          </span>{" "}
          ganhou o troféu de ouro de organização este mês
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
