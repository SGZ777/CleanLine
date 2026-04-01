"use client";

import { useState } from "react";
import HeaderAdm from "@/components/headerAdm";
import PontuacaoMedia from "@/components/pontuacaomedia";
import Sidebar from "@/components/Sidebar";

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
            Ola, Usuario | Visao Geral do{" "}
            <span className="text-[#24bff6]">5S</span>
          </h1>
        </main>

        <PontuacaoMedia/>
      </div>
    </div>
  );
}
