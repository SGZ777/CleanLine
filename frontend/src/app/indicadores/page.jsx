"use client";

import { useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import SimpleBarChart from "@/components/indicadores/graficoBarra";
import ChartPieDonutActive from "@/components/chart-pie-donut-active";

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
          <h1 className="font-inter text-2xl md:text-3xl">
            Painel de indicadores
          </h1>

          <div className="mt-10 flex justify-around">
            <div className="grid w-full justify-items-center">
              <h1 className="text-lg text-foreground md:text-2xl">
                Média dos setores no último trimestre
              </h1>
              <SimpleBarChart />
            </div>
          </div>

          <div className="flex flex-col text-center">
            <h1 className="mt-16 text-lg text-foreground md:text-2xl">
              Média das equipes no último trimestre
            </h1>
            <div className="mt-8 flex justify-center">
              <ChartPieDonutActive />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
