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

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <h1 className="font-inter text-2xl md:text-3xl md:ms-35">
            Painel de indicadores
          </h1>

          <div className="rounded-2xl w-full md:w-7xl bg-white dark:bg-[#0C1D2C] justify-self-center shadow-md mt-10 p-6 flex justify-around">
            <div className="grid w-full justify-items-center">
              <h1 className="text-lg mb-5 text-foreground md:text-2xl">
                Média dos setores no último trimestre
              </h1>
              <SimpleBarChart />
            </div>
          </div>

          <div className="flex w-full md:w-7xl justify-self-center flex-col rounded-2xl shadow-md mt-10 bg-white dark:bg-[#0C1D2C] text-center">
            <h1 className="mt-16 mb-5 text-lg text-foreground md:text-2xl">
              Média das equipes no último trimestre
            </h1>
            <div className="mb-5 flex justify-center">
              <ChartPieDonutActive />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
