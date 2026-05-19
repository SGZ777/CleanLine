"use client";

import { useEffect, useState } from "react";
import { getMaiorNotaDia } from "@/lib/controllers/dashboard";

function formatNota(value) {
  const notaNumerica = Number(value) || 0;
  const notaArredondada = Math.round(notaNumerica * 10) / 10;

  if (notaArredondada >= 10) {
    return "10";
  }

  return notaArredondada.toFixed(1);
}

// Componente de card da maior nota do dia com responsividade melhorada
export default function MaiorNotaDiaria() {
  const [nota, setNota] = useState(0);
  const [setor, setSetor] = useState('—');

  useEffect(() => {
    let ativo = true;

    async function carregarMaiorNota() {
      try {
        const data = await getMaiorNotaDia();
        if (ativo) {
          setNota(data.maiorNota ?? 0);
          setSetor(data.setor ?? '—');
        }
      } catch (error) {
        console.error("Erro ao carregar maior nota diaria:", error);
        if (ativo) {
          setNota(0);
          setSetor('—');
        }
      }
    }
    carregarMaiorNota();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="m-3 sm:m-6 h-auto w-full sm:w-80 md:w-105 rounded-[12px] border border-border bg-card pb-2 text-card-foreground shadow-md">
      <p className="text-center pt-2 text-base sm:text-lg md:text-xl lg:text-2xl mt-4 px-2">
        Maior nota do dia -{" "}
        <span className="text-[#24bff6]">Setor: {setor}</span>
      </p>
      <div className="justify-self-center flex gap-2 sm:gap-4 mt-4 pb-4 px-2">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">{formatNota(nota)}/10</p>
        <img src="./icons/icon_yellow_star.png" className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 lg:w-14 lg:h-14" />
      </div>
    </section>
  );
}
