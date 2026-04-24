"use client";

import { useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import RotasTable from "@/components/rotas/RotasTable";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/funcionarios/SearchBar";

export default function Rotas() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
       <main className="flex-1 p-6 md:p-10">
          <div className=" justify-between flex items-center mb-10 ">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
              <h1 className="text-2xl md:text-3xl font-inter">Rotas</h1>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center md:pe-35">
                <div className=" relative w-full items-center flex ">
                  <SearchBar/>
                </div>
                <Button
                  className="bg-[#1c96c2] text-white px-4 mt-3 md:mt-0 border-none md:scale-120 shadow-md"
                  onClick={() => setShowAddModal(true)}
                >
                  Adicionar +
                </Button>
              </div>
            </div>
          </div>
          <RotasTable />
        </main>
      </div>
    </div>
  );
}
