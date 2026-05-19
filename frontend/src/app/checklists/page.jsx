"use client";

import { useEffect, useState, useCallback } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import ChecklistsTable from "@/components/checklists/ChecklistsTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import { getChecklistsHoje } from "@/lib/controllers/dashboard";

// Página de listagem de checklists com responsividade melhorada
export default function Checklists() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const carregarChecklists = useCallback(async () => {
    try {
      const data = await getChecklistsHoje();
      setChecklists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarChecklists();
  }, [carregarChecklists]);
console.log("loading:", loading, "checklists:", checklists);
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-inter">
              Checklists
            </h1>
            <div className="w-full sm:w-auto md:pe-35">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
          {loading ? (
            <div className="text-center">Carregando checklists...</div>
          ) : (
            <ChecklistsTable tasks={checklists} searchTerm={searchTerm} />
          )}
        </main>
      </div>
    </div>
  );
}
