"use client";

import { useEffect, useState, useCallback } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import ChecklistsTable from "@/components/checklists/ChecklistsTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import { getChecklistsHoje } from "@/lib/controllers/dashboard";

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

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6 md:p-10">
          <div className="justify-between flex items-center mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
              <h1 className="text-2xl md:text-3xl font-inter">
                Checklists
              </h1>
              <div className="flex justify-end md:pe-35">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
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
