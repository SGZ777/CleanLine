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
    <section className="w-80 h-auto md:w-105 rounded-[25px] bg-white m-6 shadow-md">
      <p className="text-center pt-2 text-xl lg:text-3xl mt-4">
        Pontuacao media mensal
      </p>
      <div className="justify-self-center flex gap-4 mt-4">
        <p className="text-5xl pb-2 lg:text-6xl">{formatNota(nota)}/10</p>
        <img
          src="./icons/icon_green_arrow.png"
          className="w-7 h-11 lg:w-10 lg:h-13"
          alt="Seta indicativa"
        />
      </div>
    </section>
  );
}
