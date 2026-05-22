"use client";

import { useCallback, useState } from "react";
import AdicionarEquipeModal from "@/components/equipes/AdicionarEquipeModal";
import EquipesTable from "@/components/equipes/EquipesTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

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

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-10">
          <div className=" justify-between flex items-center mb-10 ">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
              <h1 className="text-2xl md:text-3xl font-inter">Equipes</h1>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center md:pe-35">
                <div className=" relative w-full items-center flex ">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                </div>
                <Button
                  className="mt-3 px-4 md:mt-0 md:scale-120 shadow-md"
                  onClick={() => setShowAddModal(true)}
                >
                  Adicionar +
                </Button>
              </div>
            </div>
          </div>
          <EquipesTable
            key={refreshKey}
            searchTerm={searchTerm}
            onAddClick={() => setShowAddModal(true)}
          />
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
