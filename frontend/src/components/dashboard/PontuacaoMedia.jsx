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

// Componente de card de pontuação média mensal com responsividade melhorada
export default function PontuacaoMedia() {
  const [nota, setNota] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarMedia() {
      try {
        const response = await apiFetch("/api/dashboard/media-mensal");

        if (!response.ok) {
          throw new Error("Falha ao buscar media mensal");
        }

        const data = await response.json();

        if (ativo) {
          setNota(data.MediaMensal ?? 0);
        }
      } catch (error) {
        console.error("Erro ao carregar pontuacao media:", error);

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
    <section className="m-3 sm:m-6 h-auto w-full sm:w-80 md:w-105 rounded-[12px] border border-border bg-card text-card-foreground shadow-md">
      <p className="text-center pt-2 text-base sm:text-lg md:text-xl lg:text-3xl mt-4 px-2">
        Pontuação média mensal
      </p>
      <div className="justify-self-center flex gap-2 sm:gap-4 mt-4 pb-4 px-2">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">{formatNota(nota)}/10</p>
        <img
          src="./icons/icon_green_arrow.png"
          className="w-5 sm:w-6 md:w-7 h-8 sm:h-10 md:h-11 lg:w-10 lg:h-13"
          alt="Seta indicativa"
        />
      </div>
    </section>
  );
}
