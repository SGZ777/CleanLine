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

export default function MaiorNotaDiaria() {
  const [nota, setNota] = useState(0);
  const [setor, setSetor] = useState("—");

  useEffect(() => {
    let ativo = true;

    async function carregarMaiorNota() {
      try {
        const data = await getMaiorNotaDia();
        if (ativo) {
          setNota(data.maiorNota ?? 0);
          setSetor(data.setor ?? "—");
        }
      } catch (error) {
        console.error("Erro ao carregar maior nota diária:", error);
        if (ativo) {
          setNota(0);
          setSetor("—");
        }
      }
    }
    carregarMaiorNota();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="m-6 transition-all hover:scale-105 h-auto w-80 rounded-xl bg-card pb-2 text-card-foreground shadow-md md:w-105 dark:border">
      <p className="text-center pt-2 text-xl ps-2 pe-2 lg:text-2xl mt-4">
        Maior nota do dia -{" "}
        <span className="text-[#24bff6]">Setor: {setor}</span>
      </p>
      <div className="flex items-center justify-center gap-4">
        <p className="text-5xl leading-none lg:text-6xl">{formatNota(nota)}/10</p>
        <img
          src="./icons/icon_yellow_star.png"
          className="w-12 h-12 lg:w-14 lg:h-14"
          alt="Estrela indicativa"
        />
      </div>
    </section>
  );
}
