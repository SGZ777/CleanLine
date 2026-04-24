"use client";

import { useCallback, useState } from "react";
import AdicionarFuncionarioModal from "@/components/funcionarios/AdicionarFuncionarioModal";
import FuncionariosTable from "@/components/funcionarios/FuncionariosTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

export default function Funcionarios() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFuncionarioAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

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
              <h1 className="text-2xl md:text-3xl font-inter">FuncionÃ¡rios</h1>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center md:pe-35">
                <div className=" relative w-full items-center flex ">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
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
          <FuncionariosTable key={refreshKey} searchTerm={searchTerm} />
        </main>
      </div>
      {showAddModal && (
        <AdicionarFuncionarioModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            handleFuncionarioAdded();
          }}
        />
      )}
    </div>
  );
}
