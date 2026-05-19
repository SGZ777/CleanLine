"use client";

import { useCallback, useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import SetoresTable from "@/components/setores/SetoresTable";
import AdicionarSetorModal from "@/components/setores/AdicionarSetorModal";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/funcionarios/SearchBar";

// Página de listagem de setores com responsividade melhorada
export default function Setores() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSetorAdded = useCallback(() => {
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-inter">Setores</h1>
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
          <SetoresTable key={refreshKey} searchTerm={searchTerm} />
        </main>
      </div>
      {showAddModal && (
        <AdicionarSetorModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            handleSetorAdded();
          }}
        />
      )}
    </div>
  );
}
