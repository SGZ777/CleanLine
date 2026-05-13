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

  useEffect(() => {
    let ativo = true;

    async function carregarMaiorNota() {
      try {
        const data = await getMaiorNotaDia();
        if (ativo) {
          setNota(data.maiorNota ?? 0);
        }
      } catch (error) {
        console.error("Erro ao carregar maior nota diaria:", error);
        if (ativo) {
          setNota(0);
        }
      }
    }
    carregarMaiorNota();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="w-80 h-auto pb-2 md:w-105 rounded-[25px] bg-white m-6 shadow-md">
      <p className="text-center pt-2 text-xl ps-2 pe-2 lg:text-2xl mt-4">
        Maior nota do dia -{" "}
        <span className="text-[#24bff6]">Setor: TI</span>
      </p>
      <div className="justify-self-center flex gap-4 mt-4">
        <p className="text-5xl pb-5 lg:text-6xl">{formatNota(nota)}/10</p>
        <img src="./icons/icon_yellow_star.png" className="w-12 h-12 lg:w-14 lg:h-14" />
      </div>
    </section>
  );
}
