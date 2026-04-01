"use client";

import { useState } from "react";
import HeaderAdm from "@/components/headerAdm";
import Sidebar from "@/components/Sidebar";

export default function Funcionarios() {
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
          <h1 className="text-3xl md:text-4xl font-inter">Funcionários</h1>
        </main>
      </div>
    </div>
  );
}
