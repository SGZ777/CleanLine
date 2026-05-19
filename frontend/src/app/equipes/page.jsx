"use client";

import { useCallback, useState } from "react";
import AdicionarEquipeModal from "@/components/equipes/AdicionarEquipeModal";
import EquipesTable from "@/components/equipes/EquipesTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

// Página de listagem de equipes com responsividade melhorada
export default function Equipes() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEquipeAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row gap-0">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-10">
          <div className="justify-between flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-inter">Equipes</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto md:pe-35">
              <div className="relative w-full sm:w-auto items-center flex">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
              <Button
                className="px-3 sm:px-4 text-sm sm:text-base scale-100 sm:scale-100 md:scale-120 shadow-md whitespace-nowrap"
                onClick={() => setShowAddModal(true)}
              >
                Adicionar +
              </Button>
            </div>
          </div>
          <EquipesTable key={refreshKey} searchTerm={searchTerm} />
        </main>
      </div>
      {showAddModal && (
        <AdicionarEquipeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            handleEquipeAdded();
          }}
        />
      )}
    </div>
  );
}
