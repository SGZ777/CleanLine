"use client";

import { useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import SimpleBarChart, { ChartBarMultiple } from "@/components/indicadores/graficoBarra";
import PieChartWithCustomizedLabel from "@/components/indicadores/graficoPizza";
import PieChartInFlexbox from "@/components/indicadores/graficosBuraco";

export default function Indicadores() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#f1f1f1] overflow-hidden">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-inter">
            Painel de indicadores
          </h1>
          <div className="flex justify-around mt-10">
            <div className="grid w-full justify-items-center"><h1 className="text-2xl text-[#0d005d]">Média dos setores no último trimestre</h1>
            <SimpleBarChart /></div>
          </div>
          <PieChartInFlexbox />
        </main>
      </div>
    </div>
  );
}