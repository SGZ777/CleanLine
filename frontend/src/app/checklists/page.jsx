"use client";

import { useState } from "react";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import ChecklistsTable from "@/components/checklists/ChecklistsTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import { Button } from "@/components/ui/button";

export default function Checklists() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
              <h1 className="text-2xl md:text-3xl font-inter">
                Checklists
              </h1>
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
          <ChecklistsTable searchTerm={searchTerm} />
        </main>
      </div>
    </div>
  );
}
