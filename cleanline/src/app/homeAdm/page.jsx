"use client";

import { useState } from "react";
import HeaderAdm from "@/components/headerAdm";
import PontuacaoMedia from "@/components/pontuacaomedia";
import Sidebar from "@/components/Sidebar";
import MaiorNotaDiaria from "@/components/maiornotadiaria";
import { PontuacaoGrafico } from "@/components/pontuacaografico";

export default function HomeAdm() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <HeaderAdm onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-inter">
            Olá, Usuário! | Visão Geral do{" "}
            <span className="text-[#24bff6]">5S</span>
          </h1>
          <div className="lg:flex">
            <PontuacaoMedia />
            <MaiorNotaDiaria />
           
          </div>
          <PontuacaoGrafico/>
          <
        </main>
      </div>
    </div>
  );
}
