"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

function formatNota(value) {
  const notaNumerica = Number(value) || 0;
  const notaArredondada = Math.round(notaNumerica * 10) / 10;

  if (notaArredondada >= 10) {
    return "10";
  }
  return notaArredondada.toFixed(1);
}

export default function PontuacaoMedia() {
  const [nota, setNota] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarMedia() {
      try {
        const response = await apiFetch("/api/dashboard/media-mensal");

        if (!response.ok) {
          throw new Error("Falha ao buscar média mensal");
        }

        const data = await response.json();

        if (ativo) {
          setNota(data.MediaMensal ?? 0);
        }
      } catch (error) {
        console.error("Erro ao carregar pontuação média:", error);

        if (ativo) {
          setNota(0);
        }
      }
    }
    carregarMedia();
    return () => {
      ativo = false;
    };
  }, []);

  return (
      <section className="my-4 flex h-40 w-80 flex-col items-center justify-center gap-3 rounded-xl bg-card text-card-foreground shadow-md transition-all hover:scale-105 md:m-6 md:h-44 md:w-105 dark:border">
      <p className="px-2 text-center text-xl leading-tight lg:text-3xl">
        Pontuação média mensal
      </p>
      <div className="flex items-center justify-center gap-4">
        <p className="text-5xl leading-none lg:text-6xl">{formatNota(nota)}/10</p>
        <img
          src="./icons/icon_green_arrow.png"
          className="w-7 h-11 lg:w-10 lg:h-13"
          alt="Seta indicativa"
        />
      </div>
    </section>
  );
}
