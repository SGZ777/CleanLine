"use client";

import { useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import SimpleBarChart from "@/components/indicadores/graficoBarra";
import ChartPieDonutActive from "@/components/indicadores/graficoBuraco";

export default function Indicadores() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <h1 className="font-inter text-2xl md:text-3xl md:ms-35 animate-fade-in-up delay-50">
            Painel de indicadores
          </h1>

           <div className="flex w-full max-w-7xl transition-all hover:scale-[1.01] justify-self-center flex-col rounded-2xl shadow-md mt-10 bg-white dark:bg-[#0C1D2C] animate-fade-in-up delay-200 overflow-hidden">
            <h1 className="mt-5 md:mt-10 ms-8 md:ms-10 mb-2 md:mb-5 text-lg text-foreground md:text-2xl">
             Média dos setores no último trimestre
            </h1>
            <div className="mb-5 flex justify-center px-4 md:px-6">
                   <SimpleBarChart />
            </div>
          </div>

          <div className="flex w-full max-w-7xl transition-all hover:scale-[1.01] justify-self-center flex-col rounded-2xl shadow-md mt-10 bg-white dark:bg-[#0C1D2C] animate-fade-in-up delay-200 overflow-hidden">
            <h1 className="mt-5 md:mt-10 ms-8 md:ms-10 mb-2 md:mb-5 text-lg text-foreground md:text-2xl">
              Média das equipes no último trimestre
            </h1>
            <div className="mb-5 flex justify-center px-4 md:px-6">
              <ChartPieDonutActive />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
